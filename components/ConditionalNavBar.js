'use client'

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function ConditionalNavBar() {
  const pathname = usePathname();

  if (pathname === '/register') {
    return null;
  }

  return <NavBar />;
} 