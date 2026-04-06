'use client';

import { useState } from 'react';

export default function PlaceOrderPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/place`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ shippingAddress: form }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('Order placed successfully! 🎉');
        setTimeout(() => {
          window.location.href = '/orders';
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
        <h1 className="text-3xl font-bold mb-6">📦 Place Order</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <form onSubmit={handleOrder}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Street</label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter street address"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter city"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter state"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter pincode"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order 🛒'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}