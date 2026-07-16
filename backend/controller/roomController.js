const bookingModels = require("../models/bookingModels");
const Room = require("../models/roomModels");
const User = require("../models/userModels");

exports.createRooms = async (hotelName, numberRooms) => {
    try {
      // Check if the hotel already has rooms created
      const existingRooms = await Room.find({ hotelName });
      if (existingRooms.length > 0) {
        throw new Error("Rooms are already created for this hotel");
      }
  
      // Create default rooms based on the number of rooms provided
      const rooms = [];
      for (let i = 1; i <= numberRooms; i++) {
        const room = new Room({
          hotelName,
          number: i.toString(),
          ac: i % 2 === 0, // Default value: even-numbered rooms have AC, odd ones do not
          standardPrice: 1000, // Default price
          maxPersons: 2, // Default maximum persons per room
        });
        rooms.push(room);
      }
  
      // Save the rooms in the database
      await Room.insertMany(rooms);
  
      return { message: `${numberRooms} rooms created successfully` };
    } catch (err) {
      console.error(err);
      throw new Error("Server error while creating rooms");
    }
  };
  

// 2. Edit rooms - allows editing the default values of a room
exports.editRoom = async (req, res) => {
    try {
      const { roomId, roomData } = req.body;
  
      // Validate input
      if (!roomId || !roomData) {
        return res.status(400).json({
          success: false,
          message: "Room ID and room data are required",
        });
      }
  
      // Find the room by its ID
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }
  
      // Update room fields based on provided `roomData`
      if (roomData.number !== undefined && roomData.number !== room.number) {
        // Check if the new room number already exists
        const existingRoom = await Room.findOne({
          hotelName: room.hotelName,
          number: roomData.number,
        });
        if (existingRoom) {
          return res.status(400).json({
            success: false,
            message: "Room with the new number already exists",
          });
        }
  
        // Update the room number
        room.number = roomData.number;
  
        // Update bookings if the room number changes
        await bookingModels.updateMany(
          { hotelName: room.hotelName, roomNo: room.number },
          { $set: { roomNo: roomData.number } }
        );
      }
  
      // Update other fields
      room.ac = roomData.ac !== undefined ? roomData.ac : room.ac;
      room.standardPrice =
        roomData.standardPrice !== undefined
          ? roomData.standardPrice
          : room.standardPrice;
      room.maxPersons =
        roomData.maxPersons !== undefined
          ? roomData.maxPersons
          : room.maxPersons;
  
      // Save the updated room details
      await room.save();
  
      res.status(200).json({
        success: true,
        message: "Room updated successfully",
        room,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error while editing room",
      });
    }
  };
  
exports.getAllRooms = async (req, res) => {
  try {
    const { hotelName } = req.body;

    const rooms = await Room.find({ hotelName });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found for this hotel" });
    }

    res.status(200).json({ rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching rooms" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { hotelName, roomNo } = req.body;

    const deletedRoom = await Room.findOneAndDelete({ hotelName, number: roomNo });
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully", deletedRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting room" });
  }
};
