import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../store/slices';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../components/loader';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, isVerified, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyEmail({ email, otp }));
  };

  useEffect(() => {
    if (isVerified) {
      navigate("/");
    }

    if (error) {
      console.error(error); // silent error
    }
  }, [isVerified, error, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2E5077] via-[#4DA1A9] to-[#79D7BE]">
          <div className="bg-[#F6F4F0] p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-[#2E5077] text-center mb-6">
              Verify Email
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2E5077]">
                  OTP
                </label>
                <input
                  type="text"
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 mt-1 border rounded"
                  placeholder="Enter OTP"
                />
              </div>

              <button className="w-full p-3 text-white bg-[#2E5077] rounded">
                Verify Email
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyEmail;