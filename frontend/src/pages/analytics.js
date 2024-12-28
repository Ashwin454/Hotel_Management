import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/loader';
import { clearBooking, getAllBookings, getAllExpenses, getAllRooms } from '../store/slices';
import Swal from 'sweetalert2';

const Analytics = () => {
  const [roomGrid, setRoomGrid] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [arrivalData, setArrivalData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0); // New state for total expenses
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { rooms, allBookings, error, loading, expenses1 } = useSelector((state) => state.book);
  const dispatch = useDispatch();

  // Fetch Room Grid and Bookings
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Data Fetch Failed',
        text: error.response?.data?.message || 'An unexpected error occurred',
      });
      dispatch(clearBooking());
    }

    const fetchRoomAndBookingData = async () => {
      if (!rooms) {
        await dispatch(getAllRooms({ hotelName: user?.data?.user1?.hotelName })).unwrap();
      }
      if (!allBookings) {
        await dispatch(getAllBookings({ hotelName: user?.data?.user1?.hotelName })).unwrap();
      }
    };
    fetchRoomAndBookingData();
  }, [rooms, allBookings, user, dispatch, error]);

  // Determine Room Occupancy
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Data Processing Failed',
        text: error.response?.data?.message || 'An unexpected error occurred',
      });
      dispatch(clearBooking());
    }

    if (rooms && allBookings) {
      const currentTime = new Date();

      const occupiedRooms = allBookings?.data?.bookings
        ?.filter((booking) => {
          const checkInTime = new Date(booking.checkIn);
          const checkOutTime = new Date(booking.checkOut);
          return currentTime >= checkInTime && currentTime <= checkOutTime;
        })
        .map((booking) => booking.roomNo);

      const updatedRoomGrid = rooms?.data?.rooms.map((room) => ({
        ...room,
        occupied: occupiedRooms.includes(room.number),
      }));

      setRoomGrid(updatedRoomGrid);

      // Calculate total earnings (all-time)
      const totalEarnings = allBookings?.data?.bookings?.reduce((acc, booking) => {
        const checkInDate = new Date(booking.checkIn);
        const checkOutDate = new Date(booking.checkOut);
        const duration = Math.max(1, Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))); // Duration in days
        const pricePerNight = booking.price;
        return acc + duration * pricePerNight;
      }, 0);

      setEarnings(totalEarnings);

      // Calculate total expenses (all-time)
      if (expenses1 && expenses1.data && expenses1.data.expenses) {
        const totalExpenseAmount = expenses1.data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpenses(totalExpenseAmount);
      } else {
        dispatch(getAllExpenses({ hotelName: user?.data?.user1?.hotelName }));
      }
    }
  }, [user, rooms, allBookings, error, dispatch, expenses1]);

  // Graph Data
  useEffect(() => {
    if (allBookings) {
      const grouped = allBookings?.data?.bookings.reduce((acc, booking) => {
        const date = booking.checkIn;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const data = Object.keys(grouped).map((date, index) => ({
        day: index + 1,
        arrivals: grouped[date],
      }));

      setArrivalData(data);
    }
  }, [allBookings]);

  const chartData = {
    labels: arrivalData.map((item) => item.day),
    datasets: [
      {
        label: 'Rate of Arrival',
        data: arrivalData.map((item) => item.arrivals),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Hotel Analytics Dashboard</h1>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          onClick={() => navigate('/customers')}
        >
          All Customers
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          onClick={() => navigate('/all/bookings')}
        >
          All Bookings
        </button>
      </div>

      {/* Graph */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold text-center mb-4">Rate of Arrival of Customers</h2>
          <Line data={chartData} />
        </div>
      )}

      {/* Total Money Earned */}
      <div className="bg-yellow-100 p-4 text-center rounded shadow">
        <h3 className="text-lg font-semibold">Total Money Earned</h3>
        <p className="text-2xl font-bold text-yellow-700">Rs. {earnings.toFixed(2)}</p>
      </div>

      {/* Total Expenses */}
      <div className="bg-red-100 p-4 text-center rounded shadow">
        <div>
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-700">Rs. {totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Total Profit */}
      <div className="bg-green-100 p-4 text-center rounded shadow">
        <h3 className="text-lg font-semibold">Total Profit</h3>
        <p className="text-2xl font-bold text-green-700">Rs. {(earnings - totalExpenses).toFixed(2)}</p>
      </div>

      {/* Room Occupancy Grid */}
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Room Occupancy Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {roomGrid &&
              roomGrid.map((room) => (
                <div
                  key={room.number}
                  className={`p-4 rounded shadow text-center font-semibold ${
                    room.occupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  Room {room.number} <br />
                  {room.occupied ? 'Occupied' : 'Available'}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
