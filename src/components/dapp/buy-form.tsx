'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { useLivePrices } from '@/hooks/use-live-prices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, Loader2, ShoppingCart, Wallet, XCircle, AlertTriangle } from 'lucide-react';
import { INRTX_PRICE_USD, MAX_PURCHASE_AMOUNT, MIN_PURCHASE_AMOUNT, POLYGON_CHAIN_ID } from '@/lib/constants';
import { buyWithMatic, buyWithUSDT } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type PaymentMethod = 'USDT' | 'MATIC';
type PurchaseState = 'idle' | 'processing' | 'success' | 'error';

export function BuyForm() {
  const { address, chainId, connectWallet, maticBalance, usdtBalance, user } = useWallet();
  const { prices, loading: pricesLoading } = useLivePrices();
  const { toast } = useToast();

  const [amount, setAmount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('USDT');
  const [purchaseState, setPurchaseState] = useState<PurchaseState>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isWrongNetwork = address && chainId !== POLYGON_CHAIN_ID;
  const usdTotal = amount * INRTX_PRICE_USD;
  const maticPrice = prices?.maticUsd || 0;
  const maticAmount = maticPrice > 0 ? usdTotal / maticPrice : 0;
  const usdtAmount = usdTotal;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setAmount(Math.min(value, MAX_PURCHASE_AMOUNT));
  };
  
  const getBalance = () => paymentMethod === 'USDT' ? usdtBalance : maticBalance;
  const getRequiredAmount = () => paymentMethod === 'USDT' ? usdtAmount : maticAmount;
  
  const hasSufficientBalance = () => {
    const balance = getBalance();
    const required = getRequiredAmount();
    return balance !== null && balance >= required;
  };
  
  const canPurchase = address && !isWrongNetwork && amount >= MIN_PURCHASE_AMOUNT && amount <= MAX_PURCHASE_AMOUNT && hasSufficientBalance() && user;

  const handleBuy = async () => {
    if (!canPurchase) {
      if (!address) toast({ title: 'Please connect your wallet first.', variant: 'destructive' });
      else if (isWrongNetwork) toast({ title: 'Please switch to Polygon network.', variant: 'destructive' });
      else if (!hasSufficientBalance()) toast({ title: 'Insufficient balance.', variant: 'destructive' });
      return;
    }
    
    setPurchaseState('processing');
    setError(null);
    setTxHash(null);

    try {
      let hash;
      if (paymentMethod === 'USDT') {
        hash = await buyWithUSDT(amount, usdtAmount, address, chainId!);
      } else {
        hash = await buyWithMatic(amount, maticAmount, address, chainId!);
      }
      setTxHash(hash);
      setPurchaseState('success');
    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred during purchase.';
      setError(errorMessage);
      setPurchaseState('error');
      toast({
        title: 'Purchase Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setPurchaseState('idle');
    setAmount(1);
    setError(null);
    setTxHash(null);
  };
  
  if (!address) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect to Purchase</CardTitle>
          <CardDescription>Connect your wallet to begin the purchase process.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connectWallet} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (purchaseState === 'success') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <CardTitle>Purchase Successful!</CardTitle>
            <CardDescription>Your INRTX-reserve tokens have been secured.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-md border p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Tokens Purchased:</span> <strong>{amount} INRTX-r</strong></div>
                <div className="flex justify-between"><span>Total Cost:</span> <strong>${usdTotal.toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>Paid With:</span> <strong>{paymentMethod}</strong></div>
                {txHash && (
                    <div className="flex justify-between items-center">
                        <span>Transaction:</span>
                        <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-xs">{`${txHash.slice(0,10)}...${txHash.slice(-8)}`}</a>
                    </div>
                )}
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>What's next?</AlertTitle>
              <AlertDescription>
                Tokens will be distributed after the sale concludes. View your contribution on the dashboard.
              </AlertDescription>
            </Alert>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button onClick={resetForm} className="w-full">Make Another Purchase</Button>
            <Button asChild variant="outline" className="w-full"><Link href="/dashboard">Go to Dashboard</Link></Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (purchaseState === 'error') {
     return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="items-center text-center">
            <XCircle className="h-16 w-16 text-destructive" />
            <CardTitle>Purchase Failed</CardTitle>
            <CardDescription>{error || 'An unexpected error occurred.'}</CardDescription>
        </CardHeader>
        <CardFooter>
            <Button onClick={resetForm} className="w-full" variant="outline">Try Again</Button>
        </CardFooter>
      </Card>
     );
  }


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Buy INRTX-reserve</CardTitle>
        <CardDescription>Select amount and payment method. Price is fixed at ${INRTX_PRICE_USD}/token.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="USDT">Pay with USDT</TabsTrigger>
            <TabsTrigger value="MATIC">Pay with MATIC</TabsTrigger>
          </TabsList>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Number of INRTX-reserve Tokens</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={MIN_PURCHASE_AMOUNT}
                max={MAX_PURCHASE_AMOUNT}
              />
            </div>

            <Card className="bg-secondary/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Balance</span>
                  <span>
                    {getBalance() === null ? <Skeleton className="h-5 w-20" /> : `${getBalance()?.toFixed(4)} ${paymentMethod}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>You Pay</span>
                  <div className="text-right">
                    {pricesLoading ? <Skeleton className="h-7 w-28" /> : 
                      <span>
                        {paymentMethod === 'USDT' ? usdtAmount.toFixed(2) : maticAmount.toFixed(4)} {paymentMethod}
                      </span>
                    }
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>USD Value</span>
                    <span>~${usdTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
             {!hasSufficientBalance() && amount > 0 && (
                <Alert variant="destructive" className="text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Insufficient Balance</AlertTitle>
                    <AlertDescription>You do not have enough {paymentMethod} to complete this purchase.</AlertDescription>
                </Alert>
             )}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!canPurchase || purchaseState === 'processing'}
          onClick={handleBuy}
        >
          {purchaseState === 'processing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy {amount} INRTX-r
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
