// pages/404.js
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#2C2F48] to-[#3A5BA0] text-white font-[Poppins] overflow-hidden">
      {/* Animated background blob */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF6EC7] opacity-30 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00FFD1] opacity-30 rounded-full filter blur-2xl animate-ping delay-1000" />
      
      {/* Main content */}
      <h1 className="text-7xl font-extrabold drop-shadow-lg z-10">404</h1>
      <p className="text-xl mt-4 z-10">Oops! This page drifted into the blobverse.</p>
      <Link href="/" className="z-10 mt-6 px-6 py-3 bg-white text-[#2C2F48] font-semibold rounded-xl shadow-md hover:bg-gray-100 transition-all">
        Back to Home
      </Link>
    </div>
  );
}
