'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUsers(parsedUser.role);
    }
  }, []);

  const fetchUsers = async (role: string) => {
    const token = localStorage.getItem('token');
    try {
      const url = role === 'admin'
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setUsers(data.users || data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const body = user?.role === 'manager'
        ? { ...form, role: 'customer' }
        : form;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('User created! Welcome email sent ✅');
        setForm({ name: '', email: '', password: '', role: 'customer' });
        setShowForm(false);
        fetchUsers(user?.role);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Something went wrong!');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('User deleted ✅');
        fetchUsers(user?.role);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error(err);
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
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'admin' ? '👥 All Users' : '👥 Customers'}
          </h1>
          <p className="text-gray-500 text-sm">
            {users?.length ?? 0} {user?.role === 'admin' ? 'users' : 'customers'} found
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 font-medium"
        >
          ➕ {user?.role === 'admin' ? 'Add User' : 'Add Customer'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-center font-medium ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Add User Form */}
      {showForm && (
        <Card>
          <CardContent className="p-5">
            <h2 className="font-bold text-lg mb-4">
              {user?.role === 'admin' ? 'Create New User' : 'Create New Customer'}
            </h2>
            <form onSubmit={handleAddUser} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                required
              />
              {user?.role === 'admin' && (
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                >
                  <option value="customer">Customer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-bold"
                >
                  Create ✅
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="flex flex-col gap-3">
        {(users ?? []).map((u) => (
          <Card key={u._id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-gray-500 text-sm">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize">{u.role}</Badge>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(users?.length ?? 0) === 0 && (
        <div className="text-center mt-20">
          <p className="text-5xl mb-4">👤</p>
          <p className="text-gray-400 text-xl">No users found!</p>
        </div>
      )}
    </div>
  );
}