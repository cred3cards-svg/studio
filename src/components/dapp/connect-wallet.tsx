'use client';

import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Wallet, LogOut, Copy, AlertTriangle } from 'lucide-react';
import { POLYGON_CHAIN_ID } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function ConnectWallet() {
  const { address, loading, connectWallet, disconnect, chainId, switchNetwork } = useWallet();
  const { toast } = useToast();
  
  const isWrongNetwork = address && chainId !== POLYGON_CHAIN_ID;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({ title: 'Address copied to clipboard' });
    }
  };

  const getShortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (loading && !address) {
    return <Skeleton className="h-10 w-36" />;
  }

  if (!address) {
    return (
      <Button onClick={connectWallet} disabled={loading}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isWrongNetwork && (
        <Button variant="destructive" size="sm" onClick={switchNetwork}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Wrong Network
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/20 text-xs">
                {address.slice(2, 4)}
              </AvatarFallback>
            </Avatar>
            {getShortAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{getShortAddress(address)}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Address</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
