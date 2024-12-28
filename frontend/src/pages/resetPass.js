import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPass } from '../store/slices';
import Swal from 'sweetalert2';
import Loader from '../components/loader';

const ResetPass = () => {
    const [confirmPass, setConfirmPass] = useState('');
    const [password, setPassword] = useState('');
    const { token } = useParams();
    const dispatch=useDispatch();
    const {loading, data, error} = useSelector((state)=> state.auth);
    const navigate=useNavigate();
    const handleSubmit=(e)=>{
      e.preventDefault();
      const formData = {password, confirmPass, token};
      dispatch(resetPass(formData));
    }
    useEffect(()=>{
      if(data){
          Swal.fire({
              icon: 'success',
              title: 'Password reset successfully',
          })
          navigate("/");
      }
      if(error){
          Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error.response?.data?.message || 'An unexpected error occurred',
          })
      }
    }, [data, error, dispatch, navigate])
  return (
    <>
    {loading ? <Loader /> : 
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2E5077] via-[#4DA1A9] to-[#79D7BE]">
      <div className="bg-[#F6F4F0] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#2E5077] text-center mb-6">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-[#2E5077]">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e)=>{setPassword(e.target.value)}}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-[#2E5077]">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPass"
              name="confirmPass"
              onChange={(e)=>{setConfirmPass(e.target.value)}}
              className="w-full p-3 mt-1 border border-[#4DA1A9] rounded focus:outline-none focus:ring focus:ring-[#79D7BE]"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#2E5077] rounded hover:bg-[#4DA1A9] transition-all"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>}
    </>
  );
};

export default ResetPass;
