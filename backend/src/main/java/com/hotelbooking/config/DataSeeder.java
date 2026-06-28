package com.hotelbooking.config;

import com.hotelbooking.model.Hotel;
import com.hotelbooking.model.Room;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public DataSeeder(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public void run(String... args) {
        if (hotelRepository.count() == 1) {
            Hotel existing = hotelRepository.findAll().get(0);
            if (!"Bengaluru".equalsIgnoreCase(existing.getCity())) {
                existing.setCity("Bengaluru");
                existing.setAddress("45 MG Road, Bengaluru");
                existing.setDescription(
                        "Luxury hotel in the heart of Bengaluru with stunning skyline views and world-class dining."
                );
                hotelRepository.save(existing);
            }
            return;
        }

        roomRepository.deleteAll();
        hotelRepository.deleteAll();

        Hotel hotel = hotelRepository.save(new Hotel(
                "Grand Plaza Hotel",
                "Luxury hotel in the heart of Bengaluru with stunning skyline views and world-class dining.",
                "Bengaluru",
                "45 MG Road, Bengaluru",
                4.8,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                List.of("Free WiFi", "Pool", "Spa", "Restaurant", "Gym")
        ));

        String roomImageUrl = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";

        roomRepository.save(new Room(
                hotel.getId(), "Standard Room",
                "Comfortable room with essential amenities and city views.",
                3500, 2, 10, roomImageUrl
        ));
        roomRepository.save(new Room(
                hotel.getId(), "Deluxe Room",
                "Spacious room with premium bedding and upgraded amenities.",
                5500, 3, 8, roomImageUrl
        ));
        roomRepository.save(new Room(
                hotel.getId(), "Suite",
                "Luxurious suite with separate living area and panoramic views.",
                9000, 4, 4, roomImageUrl
        ));
    }
}
