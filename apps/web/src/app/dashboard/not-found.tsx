import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-2">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Not Found</h3>
          <p className="text-sm text-muted-foreground">
            Could not find requested resource.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard">Return to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
