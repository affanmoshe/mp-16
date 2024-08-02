'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useParams, usePathname } from 'next/navigation';
import { ListCollapse, Percent, TicketCheck, Users, View } from 'lucide-react';

const basicClass = `font-medium text-sm py-2 px-3 rounded`;
const activeClass = `bg-background text-primary`;
const inactiveClass = `hover:bg-background`;

const EventNavigationMenu = () => {
  const { eventId } = useParams();
  const pathname = usePathname();

  return (
    <NavigationMenu className="grow-0">
      <NavigationMenuList className="bg-muted rounded-md px-1.5 py-2.5 space-x-2 text-muted-foreground">
        <NavigationMenuItem>
          <Link href={`/dashboard/events/${eventId}`} legacyBehavior passHref>
            <NavigationMenuLink
              className={`${basicClass} ${pathname === `/dashboard/events/${eventId}` && activeClass} `}
            >
              <ListCollapse className="inline sm:hidden" />
              <span className="hidden sm:inline">Overview</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={`/dashboard/events/${eventId}/promotions`}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              className={`${basicClass} ${pathname === `/dashboard/events/${eventId}/promotions` && activeClass} `}
            >
              <Percent className="inline sm:hidden" />
              <span className="hidden sm:inline">Promotions</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={`/dashboard/events/${eventId}/transactions`}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              className={`${basicClass} ${pathname === `/dashboard/events/${eventId}/transactions` && activeClass} `}
            >
              <TicketCheck className="inline sm:hidden" />
              <span className="hidden sm:inline">Transactions</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={`/dashboard/events/${eventId}/attendees`}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              className={`${basicClass} ${pathname === `/dashboard/events/${eventId}/attendees` && activeClass} `}
            >
              <Users className="inline sm:hidden" />
              <span className="hidden sm:inline">Attendees</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default EventNavigationMenu;
