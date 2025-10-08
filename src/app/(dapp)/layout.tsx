import { WalletProvider } from '@/context/wallet-provider';
import { Header } from '@/components/layout/header';

export default function DappLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="py-6 md:px-8 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with Firebase Studio. This is a prototype. Do not use with real funds.
            </p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
