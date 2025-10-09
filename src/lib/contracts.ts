import { addPurchase } from './firestore';
import { Purchase } from '@/types';
import type { EIP1193Provider } from '@/types/web3';
import { Firestore } from 'firebase/firestore';

// Minimal ERC-20 ABI for balanceOf and decimals
export const USDT_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  }
];


// Placeholder function to simulate buying with USDT
export const buyWithUSDT = async (db: Firestore, amountTokens: number, usdtAmount: number, walletAddress: string, chainId: number): Promise<string> => {
  console.log(`Simulating buyWithUSDT: ${amountTokens} tokens for ${usdtAmount} USDT`);

  // TODO: Implement real smart contract interaction
  // 1. Check/request USDT allowance for the sale contract
  // 2. Call the sale contract's buyWithUSDT function

  // Simulate a successful transaction
  await new Promise(resolve => setTimeout(resolve, 1500));
  const fakeTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const purchaseData = {
    wallet: walletAddress,
    chainId,
    paymentToken: 'USDT',
    tokensRequested: amountTokens,
    usdPerToken: 100,
    usdSubtotal: amountTokens * 100,
    currencyAmountPaid: usdtAmount,
    txHash: fakeTxHash,
  } as Omit<Purchase, 'id' | 'createdAt'>;

  await addPurchase(db, purchaseData);
  return fakeTxHash;
};

// Placeholder function to simulate buying with POL/MATIC
export const buyWithMatic = async (db: Firestore, amountTokens: number, maticAmount: number, walletAddress: string, chainId: number): Promise<string> => {
  console.log(`Simulating buyWithMatic: ${amountTokens} tokens for ${maticAmount} MATIC`);

  // TODO: Implement real smart contract interaction
  // 1. Call the sale contract's buyWithMatic function, sending maticAmount as msg.value

  // Simulate a successful transaction
  await new Promise(resolve => setTimeout(resolve, 1500));
  const fakeTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const purchaseData = {
    wallet: walletAddress,
    chainId,
    paymentToken: 'MATIC',
    tokensRequested: amountTokens,
    usdPerToken: 100,
    usdSubtotal: amountTokens * 100,
    currencyAmountPaid: maticAmount,
    txHash: fakeTxHash,
  } as Omit<Purchase, 'id' | 'createdAt'>;

  await addPurchase(db, purchaseData);
  return fakeTxHash;
};

// --- Helper function to format numbers from hex ---
const hexToBigInt = (hex: string): bigint => BigInt(hex);

const formatUnits = (value: bigint, decimals: number): number => {
  const divisor = 10n ** BigInt(decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  
  // Convert to number for floating point arithmetic
  return Number(integerPart) + Number(fractionalPart) / Number(divisor);
};


// --- Functions to interact with provider ---

export async function getMaticBalance(provider: EIP1193Provider, address: string): Promise<number> {
  try {
    const balanceHex = await provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    return formatUnits(hexToBigInt(balanceHex), 18);
  } catch (error) {
    console.error('Error fetching MATIC balance:', error);
    return 0;
  }
}

// Function to encode `balanceOf(address)`
function encodeBalanceOf(address: string): string {
  const methodId = '0x70a08231';
  const paddedAddress = address.substring(2).padStart(64, '0');
  return `${methodId}${paddedAddress}`;
}

export async function getUsdtBalance(provider: EIP1193Provider, address: string, usdtContractAddress: string): Promise<number> {
  try {
    const balanceHex = await provider.request({
      method: 'eth_call',
      params: [
        {
          to: usdtContractAddress,
          data: encodeBalanceOf(address),
        },
        'latest',
      ],
    });
    // USDT on Polygon has 6 decimals
    return formatUnits(hexToBigInt(balanceHex), 6);
  } catch (error) {
    console.error('Error fetching USDT balance:', error);
    return 0;
  }
}
