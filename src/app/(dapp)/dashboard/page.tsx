'use client';

import { useMemo } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import { KpiCards } from "@/components/dapp/dashboard/kpi-cards";
import { RecentPurchases } from "@/components/dapp/dashboard/recent-purchases";
import { SaleProgress } from "@/components/dapp/dashboard/sale-progress";
import { LivePrices } from "@/components/dapp/dashboard/live-prices";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useLivePrices } from "@/hooks/use-live-prices";
import type { Purchase, DashboardData } from "@/types";


export default function DashboardPage() {
  const firestore = useFirestore();
  
  const purchasesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "purchases"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: purchases, isLoading: purchasesLoading, error } = useCollection<Purchase>(purchasesQuery);

  const dashboardData = useMemo<DashboardData | null>(() => {
    if (!purchases) return null;

    let totalTokensSold = 0;
    let totalUsdtCollected = 0;
    let totalMaticCollected = 0;
    const buyers = new Set<string>();

    purchases.forEach((p) => {
      totalTokensSold += p.tokensRequested;
      buyers.add(p.wallet);
      if (p.paymentToken === 'USDT') {
        totalUsdtCollected += p.currencyAmountPaid;
      } else {
        totalMaticCollected += p.currencyAmountPaid;
      }
    });

    return {
      totalTokensSold,
      totalBuyers: buyers.size,
      totalUsdtCollected,
      totalMaticCollected,
      recentPurchases: [] // This will be populated by the other component
    };
  }, [purchases]);

  const { prices, loading: pricesLoading } = useLivePrices();
  
  const loading = purchasesLoading || !dashboardData;
  const recentPurchases = useMemo(() => purchases?.slice(0, 10) || null, [purchases]);

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SaleProgress data={dashboardData} loading={loading} />
          </div>
          <LivePrices prices={prices} loading={pricesLoading} />
        </div>
        
        <KpiCards data={dashboardData} prices={prices} loading={loading || pricesLoading} />
        
        <RecentPurchases purchases={recentPurchases} loading={loading} />
      </div>
    </div>
  );
}
