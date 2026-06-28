package com.hotelbooking.dto;

import com.hotelbooking.model.Room;

public class RoomAvailability {

    private Room room;
    private int availableCount;

    public RoomAvailability() {
    }

    public RoomAvailability(Room room, int availableCount) {
        this.room = room;
        this.availableCount = availableCount;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public int getAvailableCount() {
        return availableCount;
    }

    public void setAvailableCount(int availableCount) {
        this.availableCount = availableCount;
    }
}
