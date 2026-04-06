'use client';

import { useState, useEffect } from 'react';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role === 'customer') {
      window.location.href = '/products';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('Product added successfully! ✅');
        setForm({ name: '', description: '', price: '', stock: '', category: '' });
        setTimeout(() => {
          window.location.href = '/products';
        }, 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black" >➕ Add Product</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>

            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product ➕'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}