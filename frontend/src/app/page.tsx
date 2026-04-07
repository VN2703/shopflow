'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {
      const user = JSON.parse(userData);
      // If already logged in redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 mb-3">
          ShopFlow 🛒
        </h1>
        <p className="text-gray-500 text-lg">
          Your one stop shopping destination
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="bg-white text-blue-500 border border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg font-medium">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}