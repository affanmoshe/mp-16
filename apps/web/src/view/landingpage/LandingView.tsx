// src/view/landing/LandingView.tsx
import React from 'react';
import Link from 'next/link';

const LandingView: React.FC = () => {
  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/partyimg.svg)' }}
    >
      <nav className="flex justify-between items-center p-6 bg-black bg-opacity-50">
        <div className="text-white text-2xl font-bold">Konserin</div>
        <div className="space-x-4">
          <Link href="/login" passHref>
            <button className="button">Login</button>
          </Link>
          <Link href="/register" passHref>
            <button className="button">Register</button>
          </Link>
        </div>
      </nav>
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-black bg-opacity-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Discover and manage your events with ease
          </h1>
          <p className="text-lg mb-6 text-white">
            Everything you need to make your event successful, right at your
            fingertips.
          </p>
          <Link href="/discovery" passHref>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
