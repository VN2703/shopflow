'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

export default function AppSidebar() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

const adminLinks = [
  { label: '🏠 Dashboard', href: '/dashboard' },
  { label: '📋 All Products', href: '/dashboard/products' },
  { label: '➕ Add Product', href: '/dashboard/products/add' },
  { label: '📦 Orders', href: '/dashboard/orders' },
  { label: '👥 Users', href: '/dashboard/users' },
];

const managerLinks = [
  { label: '🏠 Dashboard', href: '/dashboard' },
  { label: '📋 All Products', href: '/dashboard/products' },
  { label: '➕ Add Product', href: '/dashboard/products/add' },
  { label: '📦 Orders', href: '/dashboard/orders' },
  { label: '👥 Customers', href: '/dashboard/users' },
];

  const getLinks = () => {
    if (user?.role === 'admin') return adminLinks;
    if (user?.role === 'manager') return managerLinks;
    return [];
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <div>
            <h1 className="font-bold text-lg">ShopFlow</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </SidebarHeader>

     <SidebarContent>
  <SidebarGroup>
    <SidebarGroupLabel>Main</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === '/dashboard'}
          >
            <Link href="/dashboard">🏠 Dashboard</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

         <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === '/dashboard/profile'}>
          <Link href="/dashboard/profile">👤 Profile</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  <SidebarGroup>
    <SidebarGroupLabel>Products</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === '/dashboard/products'}
          >
            <Link href="/dashboard/products">📋 All Products</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === '/dashboard/products/add'}
          >
            <Link href="/dashboard/products/add">➕ Add Product</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  <SidebarGroup>
    <SidebarGroupLabel>Orders</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === '/dashboard/orders'}
          >
            <Link href="/dashboard/orders">📦 All Orders</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  <SidebarGroup>
    <SidebarGroupLabel>Users</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === '/dashboard/users'}
          >
            <Link href="/dashboard/users">
              {user?.role === 'admin' ? '👥 All Users' : '👥 Customers'}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>


  

</SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Badge variant="outline" className="capitalize">
            {user?.role}
          </Badge>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
        >
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}