// src/ai/flows/fetch-live-prices.ts
export type LivePrices = {
  maticUsd: number; // POL/MATIC in USD
  usdtUsd: number;  // USDT in USD (≈1)
};

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token,tether&vs_currencies=usd";

/**
 * Fetch live prices for POL/MATIC and USDT in USD.
 * No top-level await, no Node-only APIs. Safe for client usage.
 */
export async function fetchLivePrices(): Promise<LivePrices> {
  const res = await fetch(COINGECKO_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Price API failed: ${res.status}`);

  const data = (await res.json()) as any;
  // polygon-ecosystem-token ~ POL/MATIC on CoinGecko
  const maticUsd = Number(data?.["polygon-ecosystem-token"]?.usd ?? 0);
  const usdtUsd = Number(data?.tether?.usd ?? 1);

  if (!Number.isFinite(maticUsd) || !Number.isFinite(usdtUsd)) {
    throw new Error("Invalid price payload");
  }

  return { maticUsd, usdtUsd };
}
