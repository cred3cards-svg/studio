import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, Firestore } from 'firebase/firestore';
import type { Purchase, DashboardData } from '@/types';

export async function addPurchase(db: Firestore, purchaseData: Omit<Purchase, 'id' | 'createdAt'>) {
  try {
    await addDoc(collection(db, 'purchases'), {
      ...purchaseData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding document: ', error);
    // In a real app, you'd want to handle this more gracefully
    throw new Error('Failed to save purchase to database.');
  }
}

export async function getDashboardData(db: Firestore): Promise<DashboardData> {
  const purchasesCol = collection(db, 'purchases');
  const q = query(purchasesCol, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  let totalTokensSold = 0;
  let totalUsdtCollected = 0;
  let totalMaticCollected = 0;
  const buyers = new Set<string>();
  const recentPurchases: Purchase[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Omit<Purchase, 'id'>;
    const purchaseWithId: Purchase = { ...data, id: doc.id };
    
    totalTokensSold += purchaseWithId.tokensRequested;
    buyers.add(purchaseWithId.wallet);

    if (purchaseWithId.paymentToken === 'USDT') {
      totalUsdtCollected += purchaseWithId.currencyAmountPaid;
    } else {
      totalMaticCollected += purchaseWithId.currencyAmountPaid;
    }
    
    if (recentPurchases.length < 10) {
      recentPurchases.push(purchaseWithId);
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
