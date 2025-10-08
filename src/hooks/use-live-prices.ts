'use client';

import { useState, useEffect } from 'react';
import { fetchLivePrices, type LivePrices } from "@/ai/flows/fetch-live-prices";

export function useLivePrices(refreshMs = 60000) {
  const [prices, setPrices] = useState<LivePrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const fetchedPrices = await fetchLivePrices();
        if (!cancelled) {
          setPrices(fetchedPrices);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load prices");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    const id = setInterval(load, refreshMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [refreshMs]);

  return { prices, loading, error };
}
