import type { Timestamp } from 'firebase/firestore';

export type Purchase = {
  id?: string;
  wallet: string;
  chainId: number;
  paymentToken: 'USDT' | 'MATIC';
  tokensRequested: number;
  usdPerToken: number;
  usdSubtotal: number;
  currencyAmountPaid: number;
  txHash: string | null;
  createdAt: Timestamp;
};

export type DashboardData = {
  totalTokensSold: number;
  totalBuyers: number;
  totalUsdtCollected: number;
  totalMaticCollected: number;
  recentPurchases: Purchase[];
};
