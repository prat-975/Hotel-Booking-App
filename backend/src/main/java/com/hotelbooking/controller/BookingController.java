package com.hotelbooking.controller;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.model.Booking;
import com.hotelbooking.security.UserPrincipal;
import com.hotelbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getMyBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return bookingService.getBookingsForUser(principal.getId());
    }

    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable String id,
                              @AuthenticationPrincipal UserPrincipal principal) {
        return bookingService.getBookingForUser(id, principal.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@Valid @RequestBody BookingRequest request,
                                 @AuthenticationPrincipal UserPrincipal principal) {
        return bookingService.createBooking(request, principal.getUser());
    }

    @DeleteMapping("/{id}")
    public Booking cancelBooking(@PathVariable String id,
                                 @AuthenticationPrincipal UserPrincipal principal) {
        return bookingService.cancelBooking(id, principal.getId());
    }
}
