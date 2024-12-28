const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: "None"
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Expense", expenseSchema);
