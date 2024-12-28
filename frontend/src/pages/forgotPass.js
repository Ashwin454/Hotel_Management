import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPass } from '../store/slices';
import Swal from 'sweetalert2';
import Loader from '../components/loader';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const dispatch=useDispatch();
  const {loading, error, data} = useSelector((state) => state.auth)
  const handleSubmit = (e) =>{
    e.preventDefault();
    const formData = {email}
    dispatch(forgotPass(formData));
  }
  useEffect(()=>{
    if(data){
        Swal.fire({
            icon: 'success',
            title: 'Please check your mail',
        })
    }
    if(error){
        Swal.fire({
            icon: 'error',
            title: 'Something Failed',
            text: error.response?.data?.message || 'An unexpected error occurred',
        })
    }
  }, [data, error, dispatch])
  return (
    <>
    {loading ? <Loader /> : 
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2E5077] via-[#4DA1A9] to-[#79D7BE]">
      <div className="bg-[#F6F4F0] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#2E5077] text-center mb-6">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[#2E5077]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e)=>{setEmail(e.target.value)}}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your email"
            />
          </div>          
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#2E5077] rounded hover:bg-[#4DA1A9] transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>}
    </>
  );
};

export default ForgotPass;
