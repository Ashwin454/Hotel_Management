// src/components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F6F4F0]">
      <div className="w-16 h-16 border-4 border-[#4DA1A9] border-t-[#2E5077] rounded-full animate-spin"></div>
      <p className="mt-4 ml-4 text-lg font-semibold text-[#4DA1A9]">Loading...</p>
    </div>
  );
};

export default Loader;
