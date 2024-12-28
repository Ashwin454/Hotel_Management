import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices';
import Loader from '../components/loader';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch=useDispatch();
  const {loading, isAuthenticated, error} = useSelector((state)=> state.auth);
  const navigate=useNavigate();

  const handleSubmit=(e)=>{
    e.preventDefault();
    const formData = {email, password};
    dispatch(login(formData));
  }
  useEffect(()=>{
    if(isAuthenticated){
        Swal.fire({
            icon: 'success',
            title: 'Loggedin successfully',
        })
        navigate("/");
    }
    if(error){
        Swal.fire({
            icon: 'error',
            title: 'SigUp Failed',
            text: error.response?.data?.message || 'An unexpected error occurred',
        })
    }
  }, [isAuthenticated, error, dispatch, navigate])
  return (
    <>
    {loading ? <Loader /> : 
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2E5077] via-[#4DA1A9] to-[#79D7BE]">
      <div className="bg-[#F6F4F0] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#2E5077] text-center mb-6">
          Log In
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
          
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#2E5077] rounded hover:bg-[#4DA1A9] transition-all"
          >
            Log In
          </button>
          <p className="mt-4 text-center text-sm text-[#2E5077]">
          Forgot Password? <a href="/forgotPass" className="text-[#4DA1A9] font-semibold">Forgot Password</a>
        </p>
        </form>
      </div>
    </div>}
    </>
  );
};

export default Login;
