import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../store/slices"; // Assuming you have this action

const AllBookings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { allBookings, error, loading } = useSelector((state) => state.book); // Assuming bookings are in this slice

  useEffect(() => {
    const fetchBookings = async () => {
      await dispatch(getAllBookings({ hotelName: user.data.user1.hotelName })).unwrap();
    };

    fetchBookings();
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p className="text-lg text-gray-700 mt-4">Loading Bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center py-5">Booking Information</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">Booking ID</th>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Room Number</th>
                <th className="px-4 py-2">CheckIn Date</th>
                <th className="px-4 py-2">CheckOut Date</th>
              </tr>
            </thead>
            <tbody>
              {allBookings &&
                allBookings?.data?.bookings.map((booking) => (
                  <tr
                    key={booking.bookingId}
                    className="border-t border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">{booking._id}</td>
                    <td className="px-4 py-2">{booking.customerName}</td>
                    <td className="px-4 py-2">{booking.roomNo}</td>
                    <td className="px-4 py-2">{booking.checkIn}</td>
                    <td className="px-4 py-2">{booking.checkOut}</td>

                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
