'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { SALE_CAP } from "@/lib/constants";
import type { DashboardData } from "@/types";

type SaleProgressProps = {
  data: DashboardData | null;
  loading: boolean;
};

export function SaleProgress({ data, loading }: SaleProgressProps) {
  const progress = data ? (data.totalTokensSold / SALE_CAP) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sale Progress</CardTitle>
        <CardDescription>
          {loading ? <Skeleton className="h-5 w-48" /> : `Showing total tokens sold towards the ${SALE_CAP.toLocaleString()} token goal.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <Skeleton className="h-4 w-full rounded-full" />
        ) : (
            <Progress value={progress} />
        )}
        <div className="mt-2 flex justify-between text-sm font-medium text-muted-foreground">
          <span>{loading ? <Skeleton className="h-5 w-24"/> : `${data?.totalTokensSold.toLocaleString() || '0'} Tokens`}</span>
          <span>{progress.toFixed(2)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
