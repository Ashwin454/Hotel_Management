import React, {useEffect, useState} from 'react';
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
  const navigate=useNavigate();
  const {loading, isAuthenticated, error} = useSelector((state) => state.auth)

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData={
        name, email, phone, password, hotelName, numberRooms
    }
    dispatch(register(formData))
  }

  useEffect(()=>{
    if(isAuthenticated){
        if(isAuthenticated){
            Swal.fire({
                icon: 'success',
                title: 'Please check you email',
            })
            navigate("/verify-email");
        }
        if(error){
            Swal.fire({
                icon: 'error',
                title: 'SigUp Failed',
                text: error.response?.data?.message || 'An unexpected error occurred',
            })
        }
    }
  }, [isAuthenticated, error, dispatch, navigate])
  return (
    <>
    {loading? <Loader/> :
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2E5077] via-[#4DA1A9] to-[#79D7BE]">
      <div className="bg-[#F6F4F0] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#2E5077] text-center mb-6">
          Sign Up
        </h1>
        <form onSubmit = {handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-[#2E5077]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[#2E5077]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="hname" className="block text-sm font-medium text-[#2E5077]">
              Hotel Name
            </label>
            <input
              type="text"
              id="hname"
              name="hName"
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nRooms" className="block text-sm font-medium text-[#2E5077]">
                Number of Rooms
            </label>
            <input
              type="number"
              id="nRooms"
              name="nRooms"
              onChange={(e) => setNumberRooms(e.target.value)}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-[#2E5077]">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-[#2E5077]">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#2E5077] rounded hover:bg-[#4DA1A9] transition-all"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#2E5077]">
          Already have an account? <a href="/login" className="text-[#4DA1A9] font-semibold">Log in</a>
        </p>
      </div>
    </div>}
    </>
  );
};

export default SignupForm;
