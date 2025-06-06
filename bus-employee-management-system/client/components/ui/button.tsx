'use client';
import React from 'react';

const Button = ({ text='Button', bgColor = 'bg-blue-600', textColor = 'text-white', onClick=()=>{}, className =''}) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-medium transition duration-200 cursor-pointer ${bgColor} ${textColor} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;