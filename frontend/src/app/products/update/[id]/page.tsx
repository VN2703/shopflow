'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    if (!user) { window.location.href = '/login'; return; }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role === 'customer') { window.location.href = '/products'; return; }
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/view/${params.id}`
      );
      const data = await response.json();
      if (data.success) {
        setForm({
          name: data.product.name,
          description: data.product.description,
          price: data.product.price,
          stock: data.product.stock,
          category: data.product.category,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/update/${params.id}`,
        {
          method: 'PUT',
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
        setMessage('Product updated successfully! ✅');
        setTimeout(() => { window.location.href = '/products'; }, 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => window.location.href = '/products'}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold text-black">✏️ Edit Product</h1>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center font-medium">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-800"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-800"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-400 text-gray-800"
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
                onClick={() => window.location.href = '/products'}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-bold disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Product ✅'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}