'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
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
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { polygon } from 'wagmi/chains';

export function ConnectWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnecting, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  
  const isWrongNetwork = address && chain?.id !== polygon.id;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({ title: 'Address copied to clipboard' });
    }
  };

  const getShortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (isConnecting) {
    return <Skeleton className="h-10 w-36" />;
  }

  if (!address) {
    return (
      <Button onClick={() => open()} disabled={isConnecting}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isWrongNetwork && (
         <Button variant="destructive" size="sm" onClick={() => open({ view: 'Networks' })}>
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
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
