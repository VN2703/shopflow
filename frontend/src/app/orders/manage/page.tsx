'use client';

import { useEffect, useState } from 'react';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { window.location.href = '/login'; return; }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role === 'customer') { window.location.href = '/dashboard'; return; }
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/update/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage(`Order status updated to ${status}! ✅`);
        fetchAllOrders();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getNextStatuses = (current: string) => {
    switch (current) {
      case 'pending': return ['confirmed', 'cancelled'];
      case 'confirmed': return ['shipped', 'cancelled'];
      case 'shipped': return ['delivered'];
      default: return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6  text-gray-800">📋 Manage Orders</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center font-medium">
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-400 text-xl">No orders yet!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow p-5">

                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-medium text-gray-400">{order._id}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 p-3 rounded-xl mb-4">
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="font-medium text-gray-600">{order.user?.name}</p>
                  <p className="text-gray-500 text-sm">{order.user?.email}</p>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Items Ordered</p>
                  <div className="flex flex-col gap-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-blue-50 p-2 rounded-lg text-gray-800">
                        <span className="text-sm font-medium">{item.product?.name}</span>
                        <span className="text-sm text-gray-500">
                          x{item.quantity} × ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-3 rounded-xl mb-4">
                  <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city},
                    {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                </div>

                {/* Total and Payment */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Payment</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Update Status Buttons */}
                {getNextStatuses(order.status).length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Update Status</p>
                    <div className="flex gap-2">
                      {getNextStatuses(order.status).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(order._id, status)}
                          className={`flex-1 py-2 rounded-xl text-white font-medium text-sm ${
                            status === 'cancelled'
                              ? 'bg-red-500 hover:bg-red-600'
                              : status === 'confirmed'
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : status === 'shipped'
                              ? 'bg-purple-500 hover:bg-purple-600'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Date */}
                <p className="text-xs text-gray-400 mt-3">
                  Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}