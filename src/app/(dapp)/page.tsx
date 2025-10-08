import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] font-headline">
          Secure the Future of INRTX
        </h1>
        <span className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Purchase INRTX-reserve tokens to build the reserve backing for INRTX, the decentralized INR stablecoin. Your participation directly strengthens the stability of the entire ecosystem.
        </span>
        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button asChild size="lg">
            <Link href="/buy">
              <ShoppingCart className="mr-2" />
              Buy Tokens
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2" />
              View Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>What is INRTX-reserve?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              INRTX-reserve is the governance and reserve token for the INRTX stablecoin. Holders participate in governance and benefit from the growth of the INRTX ecosystem.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Why Participate?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By purchasing INRTX-reserve, you are providing the critical initial capital needed to back the INRTX stablecoin, ensuring its peg and fostering trust from day one.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How it Works</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The sale is conducted on the Polygon network. You can use USDT or MATIC to buy INRTX-reserve tokens at a fixed price. All proceeds are sent to the reserve treasury.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
