import { Header } from '@/components/layout/header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Web3ModalProvider } from '@/context/web3modal-provider';

export default function DappLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <Web3ModalProvider>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </Web3ModalProvider>
    </FirebaseClientProvider>
  );
}
