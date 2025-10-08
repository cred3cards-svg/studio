import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { Purchase, DashboardData } from '@/types';
import { SALE_CAP } from './constants';

export async function addPurchase(purchaseData: Omit<Purchase, 'id' | 'createdAt'>) {
  try {
    await addDoc(collection(db, 'purchases'), {
      ...purchaseData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Failed to save purchase to database.');
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const purchasesCol = collection(db, 'purchases');
  const q = query(purchasesCol, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  let totalTokensSold = 0;
  let totalUsdtCollected = 0;
  let totalMaticCollected = 0;
  const buyers = new Set<string>();
  const recentPurchases: Purchase[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Purchase;
    data.id = doc.id;
    
    totalTokensSold += data.tokensRequested;
    buyers.add(data.wallet);

    if (data.paymentToken === 'USDT') {
      totalUsdtCollected += data.currencyAmountPaid;
    } else {
      totalMaticCollected += data.currencyAmountPaid;
    }
    
    if (recentPurchases.length < 10) {
      recentPurchases.push(data);
    }
  });

  return {
    totalTokensSold,
    totalBuyers: buyers.size,
    totalUsdtCollected,
    totalMaticCollected,
    recentPurchases,
  };
}
