'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Purchase } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

type RecentPurchasesProps = {
  purchases: Purchase[] | null;
  loading: boolean;
};

const getShortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export function RecentPurchases({ purchases, loading }: RecentPurchasesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Purchases</CardTitle>
        <CardDescription>A list of the most recent contributions to the reserve.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">USD Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
            {!loading && purchases?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-xs text-muted-foreground">
                  {p.createdAt ? formatDistanceToNow(p.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                </TableCell>
                <TableCell>
                  <a 
                    href={`https://polygonscan.com/address/${p.wallet}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-mono text-sm hover:underline"
                  >
                    {getShortAddress(p.wallet)}
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={p.paymentToken === 'USDT' ? 'default' : 'secondary'}>{p.paymentToken}</Badge>
                </TableCell>
                <TableCell className="text-right">{p.tokensRequested.toLocaleString()}</TableCell>
                <TableCell className="text-right">${p.usdSubtotal.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {!loading && (!purchases || purchases.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No purchases yet. Be the first!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
