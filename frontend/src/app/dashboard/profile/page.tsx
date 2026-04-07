'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchProfile(parsedUser._id, token);
  }, []);

  const fetchProfile = async (id: string, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setForm({ name: data.user.name, email: data.user.email });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('Profile updated! ✅');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Update failed!');
      }
    } catch (err) {
      setMessage('Something went wrong!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">👤 My Profile</h1>
        <p className="text-gray-500 text-sm">View and update your profile</p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-center font-medium ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile Details</CardTitle>
          <Badge variant="outline" className="capitalize text-blue-600 border-blue-600">
            {user?.role}
          </Badge>
        </CardHeader>
        <CardContent>

          {!editing ? (
            <div className="flex flex-col gap-4">

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-xl">{user?.name}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Full Name</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Role</span>
                  <Badge variant="outline" className="capitalize">{user?.role}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Member Since</span>
                  <span className="font-medium">
                    {new Date(user?.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-medium mt-2"
              >
                ✏️ Edit Profile
              </button>
            </div>

          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-bold"
                >
                  Save Changes ✅
                </button>
              </div>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  );
}