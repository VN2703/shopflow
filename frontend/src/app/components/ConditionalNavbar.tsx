'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setRole(user.role);
    }
  }, []);

  // Hide navbar on dashboard for admin and manager
  if (
    pathname?.startsWith('/dashboard') &&
    (role === 'admin' || role === 'manager')
  ) {
    return null;
  }

  return <Navbar />;
}