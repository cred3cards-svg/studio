'use client';

import { useEffect, useState } from "react";
import { KpiCards } from "@/components/dapp/dashboard/kpi-cards";
import { RecentPurchases } from "@/components/dapp/dashboard/recent-purchases";
import { SaleProgress } from "@/components/dapp/dashboard/sale-progress";
import { LivePrices } from "@/components/dapp/dashboard/live-prices";
import { getDashboardData } from "@/lib/firestore";
import { useLivePrices } from "@/hooks/use-live-prices";
import type { DashboardData } from "@/types";
import { useWallet } from "@/hooks/use-wallet";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { prices, loading: pricesLoading } = useLivePrices();
  const { user } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch data initially, and then set up a poller to refresh
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]); // Refetch if user changes, e.g., on purchase

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SaleProgress data={data} loading={loading} />
          </div>
          <LivePrices prices={prices} loading={pricesLoading} />
        </div>
        
        <KpiCards data={data} prices={prices} loading={loading || pricesLoading} />
        
        <RecentPurchases purchases={data?.recentPurchases || null} loading={loading} />
      </div>
    </div>
  );
}
