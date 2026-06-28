package com.hotelbooking.repository;

import com.hotelbooking.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {

    List<Room> findByHotelId(String hotelId);
}
