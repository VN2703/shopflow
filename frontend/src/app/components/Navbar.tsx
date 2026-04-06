'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        ShopFlow 🛒
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        {user && (
          <>
            <Link href="/cart" className="hover:underline">Cart</Link>
            <Link href="/orders" className="hover:underline">Orders</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>

            {/* Admin only */}
            {user?.role === 'admin' && (
              <>
                <Link href="/orders/manage" className="hover:underline">Manage Orders</Link>
                <Link href="/users" className="hover:underline">Users</Link>
              </>
            )}

            {/* Manager only */}
            {user?.role === 'manager' && (
              <Link href="/users" className="hover:underline">Customers</Link>
            )}
          </>
        )}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm">Hi, {user.name}!</span>
            <span className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-medium">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline text-sm">Login</Link>
            <Link href="/register" className="bg-white text-blue-600 px-3 py-1 rounded text-sm hover:bg-gray-100">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}