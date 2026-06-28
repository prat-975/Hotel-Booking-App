package com.hotelbooking.service;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ForbiddenException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.model.Booking;
import com.hotelbooking.model.BookingStatus;
import com.hotelbooking.model.Hotel;
import com.hotelbooking.model.Room;
import com.hotelbooking.model.User;
import com.hotelbooking.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelService hotelService;
    private final RoomService roomService;

    public BookingService(BookingRepository bookingRepository,
                          HotelService hotelService,
                          RoomService roomService) {
        this.bookingRepository = bookingRepository;
        this.hotelService = hotelService;
        this.roomService = roomService;
    }

    public List<Booking> getBookingsForUser(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public Booking getBookingForUser(String id, String userId) {
        Booking booking = getBookingById(id);
        if (booking.getUserId() == null || !booking.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have access to this booking");
        }
        return booking;
    }

    public Booking createBooking(BookingRequest request, User user) {
        validateDates(request.getCheckInDate(), request.getCheckOutDate());

        Room room = roomService.getRoomById(request.getRoomId());

        if (request.getGuests() > room.getCapacity()) {
            throw new BadRequestException(
                    "Room capacity is " + room.getCapacity() + " guests. Requested: " + request.getGuests()
            );
        }

        if (!roomService.isRoomAvailable(room.getId(), request.getCheckInDate(), request.getCheckOutDate())) {
            throw new BadRequestException("No rooms available for the selected dates");
        }

        Hotel hotel = hotelService.getHotelById(room.getHotelId());
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double totalPrice = nights * room.getPricePerNight();

        Booking booking = new Booking();
        booking.setUserId(user.getId());
        booking.setHotelId(hotel.getId());
        booking.setRoomId(room.getId());
        booking.setHotelName(hotel.getName());
        booking.setRoomType(room.getType());
        booking.setGuestName(request.getGuestName() != null && !request.getGuestName().isBlank()
                ? request.getGuestName() : user.getName());
        booking.setGuestEmail(user.getEmail());
        booking.setGuestPhone(request.getGuestPhone() != null && !request.getGuestPhone().isBlank()
                ? request.getGuestPhone() : user.getPhone());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setGuests(request.getGuests());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(String id, String userId) {
        Booking booking = getBookingForUser(id, userId);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getCheckInDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot cancel a booking that has already started");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (!checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }
        if (checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }
    }
}
