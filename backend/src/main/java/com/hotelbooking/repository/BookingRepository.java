package com.hotelbooking.repository;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByGuestEmailIgnoreCase(String guestEmail);

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByRoomIdAndStatusAndCheckInDateLessThanAndCheckOutDateGreaterThan(
            String roomId,
            BookingStatus status,
            LocalDate checkOutDate,
            LocalDate checkInDate
    );
}
