'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FetchLivePricesOutput } from "@/ai/flows/fetch-live-prices";
import { Activity } from "lucide-react";

type LivePricesProps = {
  prices: FetchLivePricesOutput | null;
  loading: boolean;
};

export function LivePrices({ prices, loading }: LivePricesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Live Prices</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground">POL/MATIC</span>
            {loading ? <Skeleton className="h-6 w-20"/> : <span className="text-xl font-bold">${prices?.maticUsd.toFixed(4)}</span>}
        </div>
        <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground">USDT</span>
            {loading ? <Skeleton className="h-6 w-20"/> : <span className="text-xl font-bold">${prices?.usdtUsd.toFixed(4)}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
