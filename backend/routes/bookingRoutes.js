const express=require("express");
const { getAvailableRooms, createBooking, updateBooking, getAllBookings, cancelBooking, checkOut, getBookings, getCustomers, getAllExpenses, createExpense, deleteExpense } = require("../controller/bookingController");

const router=express.Router();

router.route("/getAvRooms").post(getAvailableRooms);
router.route("/create-booking").post(createBooking);
router.route("/update-booking").post(updateBooking);
router.route("/get-bookings").post(getAllBookings);
router.route("/cancel-booking").post(cancelBooking);
router.route("/checkout").post(checkOut);
router.route('/get-all-bookings').post(getBookings);
router.route('/get-all-customers').post(getCustomers);
router.route('/all-expenses').post(getAllExpenses);
router.route('/add-expense').post(createExpense);
router.route('/delete-expense').post(deleteExpense);

module.exports=router;