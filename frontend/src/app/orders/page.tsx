'use client';

import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    if (userData) setUser(JSON.parse(userData));
    fetchOrders(JSON.parse(userData || '{}'));
  }, []);

 const fetchOrders = async (userData: any) => {
    const token = localStorage.getItem('token');
    try {
      const url =
        userData.role === 'customer'
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/orders/all`;  // admin AND manager both hit /all

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">
          {user?.role === 'admin' ? '📋 All Orders' : '📦 My Orders'}
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-xl text-gray-500">No orders yet!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-5">

                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-800">Order ID</p>
                    <p className="font-mono text-sm text-gray-600">{order._id}</p>
                    {user?.role === 'admin' && order.user && (
                      <p className="text-sm text-gray-500 mt-1">
                        Customer: {order.user.name} ({order.user.email})
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-b py-3 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item._id} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600">
                        {item.product?.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-400">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </p>
                    <p className="text-sm text-gray-500">
                      Payment: {' '}
                      <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-orange-500 font-medium'}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    ₹{order.totalPrice}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}