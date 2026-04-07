'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchDashboard(parsedUser.role, token);
  }, []);

  const fetchDashboard = async (role: string, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/${role}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) setDashboard(data.dashboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 ">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold capitalize">
          {user?.role} Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Welcome back, {user?.name}!
        </p>
      </div>

      {dashboard && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {user?.role === 'admin' && dashboard.users && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">👥 Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{dashboard.users.total}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">👔 Total Managers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{dashboard.users.managers}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">🛍️ Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">{dashboard.users.customers}</p>
                  </CardContent>
                </Card>
              </>
            )}

            {dashboard.products && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">📦 Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{dashboard.products.total}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">✅ Active Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{dashboard.products.active}</p>
                  </CardContent>
                </Card>
              </>
            )}

            {dashboard.orders && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">🛒 Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{dashboard.orders.total}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">⏳ Pending Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-600">{dashboard.orders.pending}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">✅ Delivered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{dashboard.orders.delivered}</p>
                  </CardContent>
                </Card>
              </>
            )}

            {user?.role === 'admin' && dashboard.revenue && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">💰 Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{dashboard.revenue.total.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Orders */}
          {dashboard.recentOrders && dashboard.recentOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📋 Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="text-left py-2">Order ID</th>
                      {user?.role === 'admin' && (
                        <th className="text-left py-2">Customer</th>
                      )}
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentOrders.map((order: any) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-mono text-xs">{order._id.slice(-8)}...</td>
                        {user?.role === 'admin' && (
                          <td className="py-2">{order.user?.name || 'N/A'}</td>
                        )}
                        <td className="py-2 font-medium">₹{order.totalPrice?.toLocaleString()}</td>
                        <td className="py-2">
                          <Badge variant="outline" className={
                            order.status === 'delivered' ? 'text-green-600 border-green-600' :
                            order.status === 'pending' ? 'text-yellow-600 border-yellow-600' :
                            order.status === 'shipped' ? 'text-blue-600 border-blue-600' :
                            'text-gray-600'
                          }>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-2 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Low Stock */}
          {dashboard.products?.lowStock?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>⚠️ Low Stock Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {dashboard.products.lowStock.map((product: any) => (
                    <div key={product._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="destructive">Stock: {product.stock}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}