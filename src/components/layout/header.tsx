import { MainNav } from './main-nav';
import { ConnectWallet } from '../dapp/connect-wallet';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <MainNav className="hidden md:flex" />
          </div>
          <nav className="flex items-center">
            <ConnectWallet />
          </nav>
        </div>
      </div>
    </header>
  );
}
