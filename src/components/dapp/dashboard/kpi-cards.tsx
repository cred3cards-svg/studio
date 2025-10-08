'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/types";
import type { FetchLivePricesOutput } from "@/ai/flows/fetch-live-prices";
import { Users, DollarSign } from "lucide-react";

type KpiCardsProps = {
  data: DashboardData | null;
  prices: FetchLivePricesOutput | null;
  loading: boolean;
};

const KpiCard = ({ title, value, icon: Icon, loading, subValue }: { title: string; value: string; icon: React.ElementType; loading: boolean; subValue?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </>
      )}
    </CardContent>
  </Card>
);

export function KpiCards({ data, prices, loading }: KpiCardsProps) {
  const maticInUsd = (data?.totalMaticCollected || 0) * (prices?.maticUsd || 0);
  const usdtInUsd = (data?.totalUsdtCollected || 0) * (prices?.usdtUsd || 0);
  const totalUsdCollected = maticInUsd + usdtInUsd;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Value Raised"
        value={`$${totalUsdCollected.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        subValue="Total USD equivalent"
        icon={DollarSign}
        loading={loading}
      />
      <KpiCard
        title="Total Buyers"
        value={data?.totalBuyers.toLocaleString() || '0'}
        subValue="Unique wallet addresses"
        icon={Users}
        loading={loading}
      />
      <KpiCard
        title="MATIC Collected"
        value={data?.totalMaticCollected.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'}
        subValue={`~ $${maticInUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        icon={DollarSign}
        loading={loading}
      />
      <KpiCard
        title="USDT Collected"
        value={data?.totalUsdtCollected.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'}
        subValue={`~ $${usdtInUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        icon={DollarSign}
        loading={loading}
      />
    </div>
  );
}
