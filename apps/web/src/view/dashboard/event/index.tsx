import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { File, PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import EventsTable from '@/components/dashboard/EventsTable';

type Props = {};

const DashboardEventView = () => {
  // const [events, setEvents] = useState<TEvent[] | null>(null);

  // useEffect(() => {
  //   const fetchEvent = async () => {
  //     const events = await instance().get(`/organizers/events`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setEvents(events.data);
  //   };

  //   fetchEvent();
  // }, []);

  return (
    <div className="flex min-h-full w-full flex-col">
      <div className="flex flex-col flex-1 sm:gap-4">
        <div className="flex-1 flex flex-col items-start gap-4 p-4 sm:pt-8">
          <div className="flex items-center w-full">
            <div className="ml-auto flex items-center gap-2">
              {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button> */}
              <Button size="sm" className="h-8 gap-1" asChild>
                <Link href="/dashboard/events/create">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Event
                  </span>
                </Link>
              </Button>
            </div>
          </div>
          <Card className="grow flex flex-col w-full">
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                Manage your events and view their sales performance.
              </CardDescription>
            </CardHeader>
            <EventsTable />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardEventView;
