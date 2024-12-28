// src/pages/PageNotFound.jsx
import React from "react";

const Nothing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F4F0]">
      <h1 className="text-[10rem] font-extrabold text-[#2E5077]">404</h1>
      <p className="text-xl text-[#4DA1A9]">Oops! The page you are looking for doesn't exist.</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-8 px-6 py-3 text-lg font-semibold text-[#F6F4F0] bg-[#79D7BE] rounded-md shadow-md hover:bg-[#4DA1A9] transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default Nothing;
