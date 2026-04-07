'use client';

import { useEffect, useState } from 'react';
import AppSidebar from '../components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setRole(user.role);
    }
  }, []);

 if (role === 'customer') {
    return <div className="p-6">{children}</div>;
}

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-4 border-b bg-white flex items-center gap-3">
            <SidebarTrigger />
            <span className="font-semibold">ShopFlow Admin</span>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}