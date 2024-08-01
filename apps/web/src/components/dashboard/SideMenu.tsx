'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  CalendarDays,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  User,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type Props = {};

const menuList = [
  {
    label: 'Dashboard',
    icon: <Home className="h-4 w-4" />,
    href: '/dashboard',
  },
  {
    label: 'Events',
    icon: <CalendarDays className="h-4 w-4" />,
    href: '/dashboard/events',
  },
  {
    label: 'Reports',
    icon: <LineChart className="h-4 w-4" />,
    href: '/dashboard/reports',
  },
  {
    label: 'Profile',
    icon: <User className="h-4 w-4" />,
    href: '/dashboard/profile',
  },
];

const SideMenu = (props: Props) => {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/konserin-logo.png"
              alt="Logo Konserin."
              width={100}
              height={32}
            />
          </Link>
          {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
        </div>
        <div className="flex-1">
          <nav className="grid items-start gap-4 px-2 text-sm font-medium lg:px-4">
            {menuList.map((item, index) => {
              return (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === item.href
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  key={`menu-${index}`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {/* <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
      </div>
    </div>
  );
};

export default SideMenu;
