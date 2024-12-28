import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader";
import { getAllBookings, logout } from "../store/slices";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loading, user } = useSelector((state) => state.auth);
  const { allBookings } = useSelector((state) => state.book);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [todayCheckIns, setTodayCheckIns] = useState(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState(0);

  const logoutSubmit = async () => {
    try {
      await dispatch(logout()).unwrap(); // Unwrap to handle any errors
      navigate('/register'); // Redirect to the registration page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    dispatch(getAllBookings({ hotelName: user?.data?.user1?.hotelName }));
  }, [dispatch, user?.data?.user1?.hotelName]);

  useEffect(() => {
    if (allBookings?.data?.bookings) {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      let checkInCount = 0;
      let checkOutCount = 0;

      allBookings?.data?.bookings?.forEach((booking) => {
        const checkInDate = new Date(booking.checkIn).toISOString().split('T')[0];
        const checkOutDate = new Date(booking.checkOut).toISOString().split('T')[0];

        if (checkInDate === today) {
          checkInCount++;
        }
        if (checkOutDate === today) {
          checkOutCount++;
        }
      });

      setTodayCheckIns(checkInCount);
      setTodayCheckOuts(checkOutCount);
    }
  }, [allBookings]);

  const bookRoom = () => {
    navigate('/book-room');
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-[#F6F4F0] min-h-screen p-6 flex flex-col">
          {/* Navbar */}
          <nav className="bg-[#2E5077] text-[#F6F4F0] py-4 px-6 flex justify-between items-center shadow-lg">
            <div className="text-2xl font-bold">Hotel Manager</div>
            <div className="flex items-center gap-4">
              <button
                className="bg-[#4DA1A9] text-white py-2 px-4 rounded hover:bg-[#79D7BE] transition-all"
                onClick={() => navigate("/expenses")}
              >
                Expenses
              </button>
              <button
                className="bg-[#4DA1A9] text-white py-2 px-4 rounded hover:bg-[#79D7BE] transition-all"
                onClick={logoutSubmit}
              >
                Logout
              </button>
            </div>
          </nav>


          {/* Welcome Banner */}
          <div className="bg-[#79D7BE] text-center py-10 rounded-lg shadow-lg mt-6 mb-6">
            <h1 className="text-4xl font-bold text-[#2E5077]">
              Welcome, {user?.data?.user1?.hotelName}!!
            </h1>
            <p className="text-lg mt-4 text-[#4DA1A9]">
              Effortlessly manage your hotel's bookings and rooms.
            </p>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex-1 bg-[#4DA1A9] text-[#F6F4F0] p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold">{todayCheckIns}</h2>
              <p className="text-lg mt-2">Check-ins Today</p>
            </div>
            <div className="flex-1 bg-[#4DA1A9] text-[#F6F4F0] p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold">{todayCheckOuts}</h2>
              <p className="text-lg mt-2">Check-outs Today</p>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-wrap justify-center items-center gap-4 flex-grow">
            <button
              className="flex-1 min-w-[150px] max-w-[250px] bg-[#2E5077] text-[#F6F4F0] py-3 px-6 rounded-lg shadow-lg text-lg font-semibold hover:bg-[#4DA1A9] transform hover:scale-105 transition duration-300"
              onClick={bookRoom}
            >
              Book Room
            </button>
            <button
              className="flex-1 min-w-[150px] max-w-[250px] bg-[#2E5077] text-[#F6F4F0] py-3 px-6 rounded-lg shadow-lg text-lg font-semibold hover:bg-[#4DA1A9] transform hover:scale-105 transition duration-300"
              onClick={() => {
                navigate('/manage-rooms');
              }}
            >
              Manage Rooms
            </button>
            <button
              className="flex-1 min-w-[150px] max-w-[250px] bg-[#2E5077] text-[#F6F4F0] py-3 px-6 rounded-lg shadow-lg text-lg font-semibold hover:bg-[#4DA1A9] transform hover:scale-105 transition duration-300"
              onClick={() => {
                navigate('/manage-bookings');
              }}
            >
              Manage Bookings
            </button>
            <button
              className="flex-1 min-w-[150px] max-w-[250px] bg-[#2E5077] text-[#F6F4F0] py-3 px-6 rounded-lg shadow-lg text-lg font-semibold hover:bg-[#4DA1A9] transform hover:scale-105 transition duration-300"
              onClick={() => {
                navigate('/analytics');
              }}
            >
              Analytics
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
