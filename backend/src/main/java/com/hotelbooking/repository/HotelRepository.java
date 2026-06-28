package com.hotelbooking.repository;

import com.hotelbooking.model.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String> {

    List<Hotel> findByCityIgnoreCase(String city);

    List<Hotel> findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(String name, String city);
}
