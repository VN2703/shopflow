'use client';

import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { window.location.href = '/login'; return; }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role === 'customer') { window.location.href = '/dashboard'; return; }
    setCurrentUser(parsedUser);
    fetchUsers(parsedUser.role);
  }, []);

  const fetchUsers = async (role: string) => {
    const token = localStorage.getItem('token');
    try {
      // Admin sees all users, Manager sees only customers
      const url = role === 'admin'
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(role === 'admin' ? data.users : data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          // Manager can only add customer — force role to customer
          body: JSON.stringify(
            currentUser?.role === 'manager'
              ? { ...form, role: 'customer' }
              : form
          ),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage(`User ${form.name} added! ✅`);
        setForm({ name: '', email: '', password: '', role: 'customer' });
        setShowForm(false);
        fetchUsers(currentUser?.role);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Something went wrong!');
    } finally {
      setFormLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('User deleted! ✅');
        fetchUsers(currentUser?.role);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-600';
      case 'manager': return 'bg-yellow-100 text-yellow-600';
      case 'customer': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">
            {currentUser?.role === 'admin' ? '👥 User Management' : '👥 Customers'}
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 font-medium"
          >
            {showForm ? '✕ Cancel' : currentUser?.role === 'admin' ? '➕ Add User' : '➕ Add Customer'}
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-xl mb-4 text-center font-medium ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {currentUser?.role === 'admin' ? 'Add New User' : 'Add New Customer'}
            </h2>
            <form onSubmit={addUser} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-600"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-600"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-600"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Role</label>
                {/* Admin sees dropdown, Manager sees fixed Customer */}
                {currentUser?.role === 'admin' ? (
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-600"
                  >
                    <option value="customer">Customer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <input
                    value="Customer (fixed)"
                    disabled
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-400"
                  />
                )}
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-bold disabled:opacity-50"
                >
                  {formLoading ? 'Adding...' : '➕ Add'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          {currentUser?.role === 'admin' && (
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-gray-400 text-sm">Managers</p>
              <p className="text-3xl font-bold text-yellow-600">
                {users.filter(u => u.role === 'manager').length}
              </p>
            </div>
          )}
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-400 text-sm">Customers</p>
            <p className="text-3xl font-bold text-green-600">
              {users.filter(u => u.role === 'customer').length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-gray-500 text-sm font-medium">User</th>
                <th className="text-left p-4 text-gray-500 text-sm font-medium">Email</th>
                {currentUser?.role === 'admin' && (
                  <th className="text-left p-4 text-gray-500 text-sm font-medium">Role</th>
                )}
                <th className="text-left p-4 text-gray-500 text-sm font-medium">Status</th>
                <th className="text-left p-4 text-gray-500 text-sm font-medium">Joined</th>
                {currentUser?.role === 'admin' && (
                  <th className="text-left p-4 text-gray-500 text-sm font-medium">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-600">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                  {currentUser?.role === 'admin' && (
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                  )}
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  {/* Delete — admin only */}
                  {currentUser?.role === 'admin' && (
                    <td className="p-4">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-gray-400">No users yet!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}