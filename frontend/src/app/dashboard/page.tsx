'use client';

import { useEffect, useState } from 'react';

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setDashboard(data.dashboard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      

      {/* Dashboard Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 capitalize text-black">
          {user?.role} Dashboard
        </h2>

        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Users Stats — Admin only */}
            {user?.role === 'admin' && dashboard.users && (
              <>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboard.users.total}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Total Managers</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboard.users.managers}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Total Customers</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {dashboard.users.customers}
                  </p>
                </div>
              </>
            )}

            {/* Products Stats */}
            {dashboard.products && (
              <>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Total Products</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboard.products.total}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Active Products</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboard.products.active}
                  </p>
                </div>
              </>
            )}

            {/* Orders Stats */}
            {dashboard.orders && (
              <>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Total Orders</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboard.orders.total}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Pending Orders</h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {dashboard.orders.pending}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm">Delivered Orders</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboard.orders.delivered}
                  </p>
                </div>
              </>
            )}

            {/* Revenue — Admin only */}
            {user?.role === 'admin' && dashboard.revenue && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600">
                  ₹{dashboard.revenue.total}
                </p>
              </div>
            )}

            {/* Customer specific */}
            {user?.role === 'customer' && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Total Spent</h3>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{dashboard.totalSpent}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}