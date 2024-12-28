import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelBooking, clearBooking, editBooking, getBookings, checkOuter } from "../store/slices"; // Add cancelBooking action
import Loader from "../components/loader";
import Swal from "sweetalert2";

const ManageBookings = () => {
  const { bookings1, loading, isEditted, error, isCancelled, isCheckedOut } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add searchTerm state
  const dispatch = useDispatch();

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditedBooking({ ...booking }); // Initialize with current booking details
    setIsModalOpen(true);
  };

  const handleCancelRequest = (booking) => {
    setBookingToCancel(booking);
    setIsConfirmCancelOpen(true);
  };

  const handleCheckout = (booking) => {
    dispatch(checkOuter({ bookingId: booking._id, hotelName:  user?.data?.user1?.hotelName, roomNo: booking.roomNo}));
    dispatch(clearBooking());
  };

  const confirmCancelBooking = async () => {
    if (bookingToCancel) {
      await dispatch(cancelBooking({ bookingId: bookingToCancel._id })).unwrap();
      dispatch(clearBooking());
      setIsConfirmCancelOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleCancelClose = () => {
    setIsConfirmCancelOpen(false);
    setBookingToCancel(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.data?.user1?.hotelName) {
        const formData = { hotelName: user.data.user1.hotelName };
        await dispatch(getBookings(formData)).unwrap();
      }
    };

    fetchBookings();
  }, [dispatch, user?.data?.user1?.hotelName, isEditted, isCancelled, isCheckedOut]);

  useEffect(() => {
    if (isCheckedOut) {
      Swal.fire({
        icon: 'success',
        title: `Checked out successfully`,
      });
      dispatch(clearBooking());
    }
    if (isEditted) {
      Swal.fire({
        icon: 'success',
        title: `Booking editted successfully`,
      });
      dispatch(clearBooking())
    }
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error while editting',
        text: error.response?.data?.message || 'An unexpected error occurred',
      });
      dispatch(clearBooking());
    }
  }, [isEditted, error, dispatch, isCancelled, isCheckedOut]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    setIsModalOpen(false);
    dispatch(editBooking({ bookingId: selectedBooking._id, updatedBookingData: editedBooking }));
    dispatch(clearBooking());
  };

  const handleCancel = () => {
    setEditedBooking({ ...selectedBooking });
    setIsModalOpen(false);
  };

  // Filter bookings based on the search term
  const filteredBookings = bookings1?.data?.bookings?.filter((booking) =>
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.adhaar.includes(searchTerm) || // You can add more fields to search by
    booking.phone.includes(searchTerm)
  );


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Manage Bookings
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by customer name, adhaar or phone"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 rounded border border-gray-300"
        />
      </div>

      {/* Bookings List */}
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBookings?.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              <h2 className="text-lg font-bold text-teal-700">
                Booking by {booking.customerName}
              </h2>
              <p className="text-gray-600">Adhaar: {booking.adhaar}</p>
              <p className="text-gray-600">Check-In: {booking.checkIn}</p>
              <p className="text-gray-600">Check-Out: {booking.checkOut}</p>
              <p className="text-gray-600">Phone: {booking.phone}</p>
              <p className="text-gray-600">Purpose: {booking.purpose}</p>
              <p className="text-gray-600">Address: {booking.address}</p>
              <p className="text-gray-600">
  Amount: {Math.max(1, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 3600 * 24))) * booking.price}
</p>
              <p className="text-gray-600">Number of Persons: {booking.numberOfPersons}</p>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleEditBooking(booking)}
                  className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCancelRequest(booking)}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCheckout(booking)}
                  className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Booking Details</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
  {/* Input fields */}
  {[
    {
      label: "Customer Name",
      name: "customerName"
    },
    {
      label: "Adhaar",
      name: "adhaar"
    },
    {
      label: "Check-In Date & Time",
      name: "checkIn",
      type: "datetime-local"
    },
    {
      label: "Check-Out Date & Time",
      name: "checkOut",
      type: "datetime-local"
    },
    {
      label: "Phone",
      name: "phone"
    },
    {
      label: "Purpose",
      name: "purpose"
    },
    {
      label: "Address",
      name: "address"
    },
    {
      label: "Number of Persons",
      name: "numberOfPersons",
      type: "number",
      min: 1
    }
  ].map(({ label, name, type, ...rest }) => (
    <div key={name}>
      <label className="block text-gray-700">{label}</label>
      <input
        type={type || "text"}
        name={name}
        value={editedBooking[name] || ""}
        onChange={handleInputChange}
        className="w-full border rounded p-2"
        {...rest}
      />
    </div>
  ))}
</div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Cancel Modal */}
      {isConfirmCancelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Cancel Booking</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
