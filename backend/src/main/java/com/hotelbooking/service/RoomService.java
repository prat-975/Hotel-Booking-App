package com.hotelbooking.service;

import com.hotelbooking.dto.RoomAvailability;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.model.Booking;
import com.hotelbooking.model.BookingStatus;
import com.hotelbooking.model.Room;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public RoomService(RoomRepository roomRepository, BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Room> getRoomsByHotelId(String hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    public List<RoomAvailability> getAvailableRooms(String hotelId, LocalDate checkIn, LocalDate checkOut) {
        List<Room> rooms = roomRepository.findByHotelId(hotelId);
        return rooms.stream()
                .map(room -> {
                    int booked = countBookedRooms(room.getId(), checkIn, checkOut);
                    int available = Math.max(0, room.getTotalRooms() - booked);
                    return new RoomAvailability(room, available);
                })
                .filter(availability -> availability.getAvailableCount() > 0)
                .toList();
    }

    public int countBookedRooms(String roomId, LocalDate checkIn, LocalDate checkOut) {
        List<Booking> overlapping = bookingRepository
                .findByRoomIdAndStatusAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                        roomId,
                        BookingStatus.CONFIRMED,
                        checkOut,
                        checkIn
                );
        return overlapping.size();
    }

    public boolean isRoomAvailable(String roomId, LocalDate checkIn, LocalDate checkOut) {
        Room room = getRoomById(roomId);
        int booked = countBookedRooms(roomId, checkIn, checkOut);
        return booked < room.getTotalRooms();
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }
}
