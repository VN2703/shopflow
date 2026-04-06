'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) { window.location.href = '/login'; return; }
    setUser(JSON.parse(userData));
    fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) setProfile(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-black">👤 My Profile</h1>

        <div className="bg-white rounded-2xl shadow p-6">

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-700">{profile?.name}</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                profile?.role === 'admin'
                  ? 'bg-red-100 text-red-600'
                  : profile?.role === 'manager'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-600'
              }`}>
                {profile?.role}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-400 text-xs font-medium mb-1">Full Name</p>
              <p className="text-gray-800 font-medium">{profile?.name}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-400 text-xs font-medium mb-1">Email</p>
              <p className="text-gray-800 font-medium">{profile?.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-400 text-xs font-medium mb-1">Role</p>
              <p className="text-gray-800 font-medium capitalize">{profile?.role}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-400 text-xs font-medium mb-1">Account Status</p>
              <p className="text-green-600 font-medium">
                {profile?.isActive ? '✅ Active' : '❌ Inactive'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-400 text-xs font-medium mb-1">Member Since</p>
              <p className="text-gray-800 font-medium">
                {new Date(profile?.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 font-medium"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}