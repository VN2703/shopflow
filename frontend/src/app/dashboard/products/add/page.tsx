'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAddProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

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
          window.location.href = '/dashboard/products';
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
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.location.href = '/dashboard/products'}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold">➕ Add Product</h1>
          <p className="text-gray-500 text-sm">Add a new product to the store</p>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-center font-medium ${
          message.includes('✅')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400"
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">📱 Electronics</option>
                <option value="Clothing">👕 Clothing</option>
                <option value="Food">🍕 Food</option>
                <option value="Books">📚 Books</option>
                <option value="Sports">⚽ Sports</option>
                <option value="Other">📦 Other</option>
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => window.location.href = '/dashboard/products'}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-bold disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Product ➕'}
              </button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}