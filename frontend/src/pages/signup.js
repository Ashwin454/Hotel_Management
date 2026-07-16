import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices';
import Loader from '../components/loader';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [numberRooms, setNumberRooms] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!numberRooms || Number(numberRooms) <= 0) {
      Swal.fire("Error", "Enter valid number of rooms", "error");
      return;
    }

    const formData = {
      name,
      email,
      phone,
      password,
      hotelName,
      numberRooms: Number(numberRooms), // ✅ FIX
    };

    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/verify-email", { state: { email } });
    }

  }, [isAuthenticated, error, navigate, email]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2E5077] via-[#4DA1A9] to-[#79D7BE]">
          <div className="bg-[#F6F4F0] p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-[#2E5077] text-center mb-6">
              Sign Up
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Hotel Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">Hotel Name</label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter your hotel name"
                  required
                />
              </div>

              {/* Number of Rooms */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  value={numberRooms}
                  onChange={(e) => setNumberRooms(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter number of rooms"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button className="w-full p-3 text-white bg-[#2E5077] rounded hover:bg-[#1f3a5f] transition">
                Sign Up
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-[#2E5077]">
              Already have an account?{" "}
              <a href="/login" className="text-[#4DA1A9] font-semibold">
                Log in
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupForm;