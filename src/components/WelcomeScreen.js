import React from 'react';

const WelcomeScreen = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 via-yellow-200 to-orange-600 z-50 animate-fadeIn">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-orange-300 opacity-30 rounded-full top-[-10%] left-[-10%] animate-pulse-slow" />
        <div className="absolute w-80 h-80 bg-yellow-200 opacity-20 rounded-full bottom-[-10%] right-[-10%] animate-pulse-slow" />
        <div className="absolute w-60 h-60 bg-orange-500 opacity-20 rounded-full top-[30%] left-[60%] animate-pulse-slow" />
      </div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-orange-700 drop-shadow mb-4 animate-slideInDown">Welcome to Manomantapa Media</h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fadeIn delay-200">Explore spiritual and wellness content curated just for you.</p>
        <button
          onClick={onEnter}
          className="px-8 py-4 bg-orange-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all transform hover:scale-105 active:scale-95 animate-bounceIn"
        >
          Enter Media Library
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen; 