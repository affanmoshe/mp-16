import { Loader2Icon } from 'lucide-react';
import React from 'react';

type Props = {};

const DashboardLoading = (props: Props) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 h-full bg-muted/50">
      <Loader2Icon className="size-4 animate-spin" />
      Loading...
    </div>
  );
};

export default DashboardLoading;
