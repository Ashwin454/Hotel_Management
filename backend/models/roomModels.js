const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true, // References the hotel by name
  },
  number: {
    type: String,
    required: true,
  },
  ac: {
    type: Boolean,
    required: true,
  },
  standardPrice: {
    type: Number,
    required: true,
  },
  maxPersons: {
    type: Number,
    required: true,
  },
  occupied: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Room", roomSchema);
