const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true, // References the hotel by name
  },
  roomNo: {
    type: String,
    required: true, // Refers to the room number in the Room collection
  },
  customerName: {
    type: String,
    required: true,
  },
  adhaar: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  numberOfPersons: {
    type: Number,
    required: true,
  },
  isCheckedOut: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
