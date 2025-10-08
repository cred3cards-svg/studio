'use client';

import { useState, useEffect } from 'react';
import { fetchLivePrices, type FetchLivePricesOutput } from '@/ai/flows/fetch-live-prices';

export function useLivePrices(refreshInterval: number = 60000) {
  const [prices, setPrices] = useState<FetchLivePricesOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPrices = async () => {
      try {
        setLoading(true);
        const livePrices = await fetchLivePrices();
        setPrices(livePrices);
        setError(null);
      } catch (e) {
        setError('Could not fetch live prices. Please try again later.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    getPrices(); // Initial fetch

    const intervalId = setInterval(getPrices, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return { prices, loading, error };
}
