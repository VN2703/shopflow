'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchOrders(parsedUser.role);
    }
  }, []);

  const fetchOrders = async (role: string) => {
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
        setMessage(`Order updated to ${status}! ✅`);
        fetchOrders(user?.role);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 border-yellow-600';
      case 'confirmed': return 'text-blue-600 border-blue-600';
      case 'shipped': return 'text-purple-600 border-purple-600';
      case 'delivered': return 'text-green-600 border-green-600';
      case 'cancelled': return 'text-red-600 border-red-600';
      default: return 'text-gray-600';
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
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">📦 Orders</h1>
        <p className="text-gray-500 text-sm">Manage and update order status</p>
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-xl text-center font-medium">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-400 text-xl">No orders yet!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-5">

                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-medium">
                      {order._id}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Customer: {order.user?.name} ({order.user?.email})
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Items Ordered</p>
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm py-1">
                      <span className="font-medium">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="text-gray-500">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                </div>

                {/* Total and Payment */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{order.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Payment</p>
                    <Badge variant="outline" className={
                      order.paymentStatus === 'paid'
                        ? 'text-green-600 border-green-600'
                        : 'text-yellow-600 border-yellow-600'
                    }>
                      {order.paymentStatus?.toUpperCase()}
                    </Badge>
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

                {/* Date */}
                <p className="text-xs text-gray-400 mt-3">
                  Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}