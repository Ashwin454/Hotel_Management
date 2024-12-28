const Booking = require("../models/bookingModels");
const Room = require("../models/roomModels");
const User = require("../models/userModels");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// 1. Get available rooms for a given hotel between check-in and check-out dates
exports.getAvailableRooms = async (req, res) => {
  try {
    const { hotelName, checkIn, checkOut } = req.body;
    if(!hotelName || !checkIn || !checkOut){
        return res.status(400).json({
            success: false,
            message: "Enter dates"
        })
    }
    console.log(hotelName, checkIn, checkOut);

    // Get all rooms for the hotel
    const rooms = await Room.find({ hotelName });
    const checkInDate = new Date(checkIn); // Set check-in to current time
    const checkOutDate = new Date(checkOut); // Parse the provided check-out date

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date",
      });
    }

    // Set the check-out time to 11:00 AM IST
    checkOutDate.setHours(11, 0, 0, 0); // Set check-out time to 11:00 AM IST
    checkInDate.setHours(11, 0, 0, 0)
    // Convert check-out time from UTC to IST (UTC + 5:30)
    const offsetIST = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // UTC + 5:30
    checkOutDate.setTime(checkOutDate.getTime() + offsetIST); // Add IST offset to the check-out time

    // Set the check-in time to current time (in IST)
    checkInDate.setTime(checkInDate.getTime() + offsetIST); // Adjust check-in time for IST

    // Check if rooms are booked in the specified date range
    const bookings = await Booking.find({
      hotelName,
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    // Get room numbers that are already booked
    const bookedRooms = bookings.map((booking) => booking.roomNo);

    // Filter rooms that are not booked
    const availableRooms = rooms.filter((room) => !bookedRooms.includes(room.number));

    if (availableRooms.length === 0) {
      return res.status(404).json({ message: "No available rooms found for the selected dates" });
    }

    res.status(200).json({ availableRooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching available rooms" });
  }
};

// 2. Create a new booking for the hotel
exports.createBooking = async (req, res) => {
    try {
      const { hotelName, customerName, adhaar, checkIn, checkOut, address, phone, purpose, roomNo, price, age, numberOfPersons } = req.body;
  
      if (!hotelName || !customerName || !adhaar || !checkIn || !checkOut || !address || !phone || !roomNo || !price) {
        return res.status(400).json({
          success: false,
          message: "Give complete data",
        });
      }
  
      // Ensure checkIn and checkOut are valid dates
      const checkInDate = new Date(checkIn); // Set check-in to current time
      const checkOutDate = new Date(checkOut); // Parse the provided check-out date
      
      const offsetIST = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // UTC + 5:30
      checkOutDate.setTime(checkOutDate.getTime() + offsetIST); // Add IST offset to the check-out time
  
      // Set the check-in time to current time (in IST)
      checkInDate.setTime(checkInDate.getTime() + offsetIST); // Adjust check-in time for IST
  
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid check-in or check-out date",
        });
      }
  
  
      const room = await Room.findOne({ hotelName, number: roomNo });
      if (!room) {
        return res.status(400).json({ message: "Room not found in the specified hotel" });
      }
      
      // Create a new booking
      const newBooking = new Booking({
        hotelName,
        customerName,
        adhaar,
        checkIn: checkInDate, // Set current time as check-in (IST)
        checkOut: checkOutDate, // Set 11:00 AM IST as check-out
        address,
        phone,
        purpose,
        roomNo,
        price,
        age,
        numberOfPersons,
      });
      room.occupied = true;
      await room.save();
      await newBooking.save();
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking: newBooking,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error while creating booking",
      });
    }
  };
      
// 3. Update booking check-out date according to room availability
exports.updateBooking = async (req, res) => {
    try {
      const { bookingId, updatedBookingData } = req.body;
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Extract the updated checkIn and checkOut dates
      const { checkIn, checkOut } = updatedBookingData;
  
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
  
      // Define the IST offset
      const offsetIST = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // UTC + 5:30
  
      // Adjust for IST
      checkInDate.setTime(checkInDate.getTime() + offsetIST);
      checkOutDate.setTime(checkOutDate.getTime() + offsetIST);
  
      // Check if the room is available for the updated check-in and check-out dates
      const conflictingBookings = await Booking.find({
        hotelName: booking.hotelName,
        roomNo: booking.roomNo,
        _id: { $ne: bookingId }, // Exclude the current booking from the conflict check
        $or: [
          {
            checkIn: { $lt: checkOutDate }, // Overlaps if current check-in is before the new check-out
            checkOut: { $gt: checkInDate }, // Overlaps if current check-out is after the new check-in
          },
        ],
      });
  
      if (conflictingBookings.length > 0) {
        return res.status(400).json({
          message: "The room is already booked for the selected dates",
        });
      }
  
      // Update the booking with the new details and IST-adjusted dates
      for (const key in updatedBookingData) {
        if (updatedBookingData.hasOwnProperty(key)) {
          booking[key] = updatedBookingData[key];
        }
      }
      booking.checkIn = checkInDate;
      booking.checkOut = checkOutDate;
  
      // Save the updated booking
      await booking.save();
  
      res
        .status(200)
        .json({ message: "Booking updated successfully", booking });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Server error while updating booking" });
    }
  };
    
// 4. Get all bookings for a specific hotel

exports.getAllBookings = async (req, res) => {
    try {
      const { hotelName } = req.body;
  
      // Get current date and time
      const currentDate = new Date(); // No need for moment.js if you don't want to use it
  
      // Fetch all bookings for the hotel where checkIn and checkOut are after the current date,
      // and sort by checkIn date (ascending order)
      const bookings = await Booking.find({
        hotelName,
        isCheckedOut: false
      })
      .sort({ checkIn: 1 }); // Sort in ascending order of checkIn date (1 = ascending, -1 = descending)
  
      if (!bookings || bookings.length === 0) {
        return res.status(200).json({ message: "No bookings found for this hotel with check-in and check-out after today's date" });
      }
  
      res.status(200).json({ bookings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error while fetching all bookings" });
    }
  };
  
exports.cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.body;
  
      // Validate input
      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: "Booking ID is required to cancel a booking",
        });
      }
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }
  
      // Delete the booking
      await booking.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error while cancelling booking",
      });
    }
};

const path = require('path');
const expenseModel = require("../models/expenseModel");

exports.checkOut = async (req, res) => {
    try {
        const { bookingId, hotelName, roomNo } = req.body;

        // Validate input
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required for check-out",
            });
        }

        // Find the booking by ID
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if the booking is already checked out
        if (booking.isCheckedOut) {
            return res.status(400).json({
                success: false,
                message: "This booking is already checked out",
            });
        }

        // Mark the booking as checked out
        booking.isCheckedOut = true;
        const checkOutDate = new Date();
        const offsetIST = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // UTC + 5:30
        checkOutDate.setTime(checkOutDate.getTime() + offsetIST); // Add IST offset to the check-out time

        booking.checkOut = checkOutDate; // Record the check-out time
        const room = await Room.findOne({ hotelName, number: roomNo });
        room.occupied =false;
        await room.save();
        // Save the updated booking
        await booking.save();

        // Ensure the receipts folder exists
        const receiptsDir = path.join(__dirname, '..', 'receipts');
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir);
        }

        // Calculate the number of days spent in the booking
        const checkInDate = new Date(booking.checkIn);
        const daysSpent = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24)));  // Ensure at least 1 day
        const amountPaid = daysSpent * booking.price;  // Amount = days * price per day

        // Generate the receipt PDF
        const doc = new PDFDocument();

        // Set headers for downloading the file
        res.setHeader('Content-Disposition', `attachment; filename=receipt_${booking.customerName}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        // Pipe the PDF directly to the response
        doc.pipe(res);

        doc.fontSize(20).text(`Booking Receipt`, { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Booking ID: ${booking._id}`);
        doc.text(`Guest Name: ${booking.customerName}`);
        doc.text(`Room Number: ${booking.roomNo}`);
        doc.text(`Check-in Date: ${booking.checkIn}`);
        doc.text(`Check-out Date: ${booking.checkOut}`);
        doc.text(`Amount Paid: $${amountPaid.toFixed(2)}`);  // Display the calculated amount
        doc.text(`Booking Status: Checked Out`);
        doc.moveDown();
        doc.text(`Thank you for staying with us!`, { align: "center" });

        // Finalize the PDF document
        doc.end();

        // Log the message after the PDF is generated and sent
        doc.on('end', () => {
            console.log("PDF generation complete for:", booking.customerName);
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error while processing check-out",
        });
    }
};
exports.getBookings = async(req, res)=>{
    try {
        const { hotelName } = req.body;
    
        const bookings = await Booking.find({
          hotelName,
        })
        .sort({ checkIn: 1 }); // Sort in ascending order of checkIn date (1 = ascending, -1 = descending)
    
        if (!bookings || bookings.length === 0) {
          return res.status(200).json({ message: "No bookings found for this hotel" });
        }
    
        res.status(200).json({ bookings });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching all bookings" });
      }
}
exports.getCustomers = async (req, res) => {
    try {
      // Fetch all bookings
      const { hotelName } = req.body;
    
      const bookings = await Booking.find({
        hotelName,
      })

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No customers found",
        });
      }
  
      // Create a map to track customers and their visit counts
      const customerMap = {};
  
      bookings.forEach((booking) => {
        const { customerName, adhaar, phone } = booking;
        const key = `${adhaar}`; // Use Aadhaar as a unique identifier
  
        if (!customerMap[key]) {
          // Add new customer to the map
          customerMap[key] = {
            name: customerName,
            adhaar: adhaar,
            phone: phone,
            visitCount: 0,
          };
        }else{
            customerMap[key].visitCount++;
        }
  
        // Increment visit count
      });
  
      // Convert the map to an array of customer details
      const customers = Object.values(customerMap);
  
      res.status(200).json({
        success: true,
        customers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error while fetching customers",
      });
    }
  };

  exports.createExpense = async (req, res) => {
    try {
      const { name, amount, hotelName } = req.body;
  
      if (!amount) {
        return res.status(400).json({
          success: false,
          message: "Enter amount correctly",
        });
      }
  
      // Get the current IST date
      const now = new Date();
      const offsetIST = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // UTC + 5:30
      const currentISTDate = new Date(now.getTime() + offsetIST);
  
      const newExpense = new expenseModel({
        hotelName,
        name,
        amount,
        date: currentISTDate, // Save the IST date
      });
  
      await newExpense.save();
  
      return res.status(200).json({
        success: true,
        expense: newExpense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
exports.getAllExpenses = async (req, res) => {
    try {
      const {hotelName} = req.body;
      const expenses = await expenseModel.find({
        hotelName
      }); // Fetch all expenses
      return res.status(200).json({
        success: true,
        expenses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error while fetching expenses",
      });
    }
  };
  
  exports.deleteExpense = async (req, res) => {
    try {
      const { expenseId } = req.body;
  
      // Find and delete the expense by ID
      const deletedExpense = await expenseModel.findByIdAndDelete(expenseId);
  
      if (!deletedExpense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
        deletedExpense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error while deleting expense",
      });
    }
  };
  