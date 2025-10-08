'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { signInAnonymously, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { POLYGON_CHAIN_ID, POLYGON_CHAIN_ID_HEX, USDT_ADDRESS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import type { EIP1193Provider } from '@/types/web3';
import { getMaticBalance, getUsdtBalance } from '@/lib/contracts';

interface WalletState {
  provider: EIP1193Provider | null;
  address: string | null;
  chainId: number | null;
  maticBalance: number | null;
  usdtBalance: number | null;
  user: User | null;
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

export const WalletContext = createContext<WalletState | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<EIP1193Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [maticBalance, setMaticBalance] = useState<number | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getProvider = (): EIP1193Provider | null => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }
    return null;
  };

  const updateBalances = useCallback(async (currentProvider: EIP1193Provider, currentAddress: string) => {
    if (currentProvider && currentAddress) {
      const matic = await getMaticBalance(currentProvider, currentAddress);
      setMaticBalance(matic);
      const usdt = await getUsdtBalance(currentProvider, currentAddress, USDT_ADDRESS);
      setUsdtBalance(usdt);
    }
  }, []);

  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setLoading(true);
      const newAddress = accounts[0];
      setAddress(newAddress);
      const currentProvider = getProvider();
      if (currentProvider) {
        await updateBalances(currentProvider, newAddress);
        await signInAnonymously(auth).then(cred => setUser(cred.user));
      }
      setLoading(false);
    }
  }, [updateBalances]);

  const handleChainChanged = (newChainId: string) => {
    setChainId(parseInt(newChainId, 16));
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
    setMaticBalance(null);
    setUsdtBalance(null);
    setUser(null);
    auth.signOut();
    toast({ title: "Wallet Disconnected" });
  };

  const connectWallet = async () => {
    const currentProvider = getProvider();
    if (!currentProvider) {
      toast({
        title: 'Wallet not found',
        description: 'Please install a wallet extension like MetaMask.',
        variant: 'destructive',
      });
      return;
    }
    setProvider(currentProvider);

    try {
      setLoading(true);
      const accounts = await currentProvider.request({ method: 'eth_requestAccounts' });
      const currentChainId = await currentProvider.request({ method: 'eth_chainId' });
      
      handleAccountsChanged(accounts);
      handleChainChanged(currentChainId);

      if(parseInt(currentChainId, 16) !== POLYGON_CHAIN_ID) {
        await switchNetwork();
      }

    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'User rejected the request.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async () => {
    const currentProvider = getProvider();
    if (!currentProvider) return;
    try {
      await currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_CHAIN_ID_HEX }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await currentProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: POLYGON_CHAIN_ID_HEX,
                chainName: 'Polygon Mainnet',
                rpcUrls: ['https://polygon-rpc.com/'],
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          toast({
            title: 'Failed to add Polygon network',
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'Failed to switch network',
          description: 'Please switch to the Polygon network manually in your wallet.',
          variant: 'destructive'
        });
      }
    }
  };

  useEffect(() => {
    const currentProvider = getProvider();
    if (currentProvider) {
      setProvider(currentProvider);
      currentProvider.on('accountsChanged', handleAccountsChanged);
      currentProvider.on('chainChanged', handleChainChanged);

      return () => {
        currentProvider.removeListener('accountsChanged', handleAccountsChanged);
        currentProvider.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged]);

  useEffect(() => {
    if (provider && address) {
        updateBalances(provider, address);
    }
  }, [chainId, address, provider, updateBalances]);

  return (
    <WalletContext.Provider value={{ provider, address, chainId, maticBalance, usdtBalance, user, loading, connectWallet, disconnect, switchNetwork }}>
      {children}
    </WalletContext.Provider>
  );
};
