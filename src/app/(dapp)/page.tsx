'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, TrendingUp, Shield, BarChart, Milestone, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const revenueStreams = [
  {
    title: '1. Arbitrage Profits',
    content: 'INRTX Reserve participates in automated arbitrage across decentralized and centralized exchanges. Profits from price inefficiencies are pooled and distributed to reserve token holders.',
  },
  {
    title: '2. Gas Fee Optimization and Rebates',
    content: 'INRTX uses smart routing and layer-2 infrastructure to capture a share of gas efficiency rebates, adding to yield.',
  },
  {
    title: '3. Staking and Validator Rewards',
    content: 'Tokens are deployed into high-yield staking protocols. Rewards are auto-compounded and redistributed monthly.',
  },
  {
    title: '4. Liquidity Provisioning',
    content: 'Strategic deployment of liquidity across DeFi pools to earn trading fees and incentives.',
  },
];

const reserveStructure = [
  { component: 'Core Reserve Vault', allocation: '50%', description: 'Stable assets ensuring liquidity & redemption capability' },
  { component: 'Arbitrage Fund', allocation: '25%', description: 'Capital allocated for cross-market trading' },
  { component: 'Staking Nodes', allocation: '15%', description: 'Validator nodes across major networks (ETH, BSC, Solana)' },
  { component: 'Liquidity Pools', allocation: '10%', description: 'Deployed in selected DEX/AMM pools for yield farming' },
];

const roadmap = [
    { phase: "Phase 1", timeline: "Q4 2025", milestone: "Token sale and reserve setup" },
    { phase: "Phase 2", timeline: "Q1 2026", milestone: "Arbitrage engine and validator deployment" },
    { phase: "Phase 3", timeline: "Q2 2026", milestone: "Exchange listings and cross-chain bridge launch" },
    { phase: "Phase 4", timeline: "Q3 2026", milestone: "Full DAO governance rollout" },
];

const investorProtections = [
    { title: 'Asset-Backed Tokens', description: 'Each token is redeemable against a proportional share of reserve value.' },
    { title: 'Smart Contract Audits', description: 'INRTX protocols are independently verified.' },
    { title: 'Liquidity Assurance', description: 'A portion of the reserve is held in instantly redeemable stablecoins.' },
    { title: 'Transparent Governance', description: 'Token holders can vote on future staking and arbitrage parameters.' },
]

export default function HomePage() {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const annualReturnRate = 0.24;
  
  const calculateReturns = (amount: number) => {
    const annualReturn = amount * annualReturnRate;
    const monthlyPayout = annualReturn / 12;
    const compoundedValue = amount * Math.pow(1 + annualReturnRate / 12, 12);
    return {
      annualReturn,
      monthlyPayout,
      compoundedValue,
    };
  };
  
  const returns = calculateReturns(investmentAmount);


  return (
    <div className="container relative py-12 md:py-16">
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] font-headline">
          INRTX Reserve Token – Investor Plan
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground sm:text-xl">
          INRTX is a reserve-backed token designed to generate sustainable, high-yield returns through multiple DeFi-based income streams. Participate by purchasing INRTX Reserve Tokens, representing fractional ownership in a reserve pool that fuels our revenue-generating operations.
        </p>
        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button asChild size="lg">
            <Link href="/buy">
              <ShoppingCart className="mr-2" />
              Purchase INRTX-R
            </Link>
          </Button>
        </div>
      </section>
      
      <div className="mx-auto max-w-5xl space-y-16">
        
        {/* Value Proposition */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 font-headline">The INRTX Value Proposition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit"><TrendingUp size={32} /></div>
                <CardTitle>Up to 24% APY</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Earn high-yield returns, backed by transparent, blockchain-tracked yield sources.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit"><Shield size={32} /></div>
                <CardTitle>Reserve-Backed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Every INRTX-R token is backed by real assets held within the INRTX reserve vault.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit"><BarChart size={32} /></div>
                <CardTitle>Real Yield Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Returns are generated from operational profits, not new investor inflows or speculation.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Revenue Streams */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 font-headline">Multiple Revenue Streams</h2>
           <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {revenueStreams.map((stream, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold">{stream.title}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {stream.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Yield Illustration & Calculator */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 font-headline">Example Yield Illustration</h2>
          <Card>
            <CardHeader>
                <CardTitle>Investment Return Calculator</CardTitle>
                <CardDescription>Enter an investment amount to see potential returns at our target 24% APY.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="investment-amount">Your Investment ($)</Label>
                        <Input
                            id="investment-amount"
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="text-lg"
                            placeholder="e.g., 10000"
                        />
                    </div>
                     <Button onClick={() => setInvestmentAmount(10000)} variant="outline">
                        Start with $10,000
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground">Monthly Payout</p>
                        <p className="text-2xl font-bold">${returns.monthlyPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground">Annual Return</p>
                        <p className="text-2xl font-bold">${returns.annualReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground">1-Year Compounded Value</p>
                        <p className="text-2xl font-bold">${returns.compoundedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Investor Protections */}
        <section>
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Investor Protections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {investorProtections.map((protection) => (
                    <Card key={protection.title}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Shield className="w-8 h-8 text-primary" />
                            <CardTitle className="text-xl">{protection.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{protection.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* Investor Returns & Reserve Structure */}
        <section className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Investor Returns</h3>
                <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3"><CheckCircle className="text-primary h-5 w-5" /> <strong>Target APY:</strong> Up to 24% per annum</li>
                    <li className="flex items-center gap-3"><CheckCircle className="text-primary h-5 w-5" /> <strong>Distribution:</strong> Monthly</li>
                    <li className="flex items-center gap-3"><CheckCircle className="text-primary h-5 w-5" /> <strong>Payout Form:</strong> Auto-compounded INRTX-R or USDT</li>
                    <li className="flex items-center gap-3"><CheckCircle className="text-primary h-5 w-5" /> <strong>Profit Split:</strong> 60% to investors, 40% for growth</li>
                </ul>
            </div>
             <div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Reserve Structure</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Component</TableHead>
                            <TableHead className="text-right">Allocation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reserveStructure.map((item) => (
                            <TableRow key={item.component}>
                                <TableCell className="font-medium">{item.component}</TableCell>
                                <TableCell className="text-right font-mono">{item.allocation}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-2">Reserve audits are performed quarterly by independent DeFi analytics partners.</p>
            </div>
        </section>
        
        {/* Tokenomics */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 font-headline">Tokenomics</h2>
          <Card>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Token Name</p>
                <p className="font-bold text-lg">INRTX Reserve Token</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Symbol</p>
                <p className="font-bold text-lg">INRTX-R</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Supply</p>
                <p className="font-bold text-lg">100 Million</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Blockchain</p>
                <p className="font-bold text-lg">Ethereum (ERC-20)</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Roadmap */}
        <section>
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Our Roadmap</h2>
            <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" aria-hidden="true"></div>
                {roadmap.map((item, index) => (
                    <div key={item.phase} className="relative mb-8 md:mb-12">
                        <div className="md:flex items-center md:justify-between">
                            <div className="md:w-5/12">
                                {index % 2 === 0 ? (
                                    <div className="text-left md:text-right md:pr-8">
                                        <p className="text-primary font-bold">{item.timeline}</p>
                                        <h4 className="text-xl font-bold mt-1">{item.phase}</h4>
                                        <p className="text-muted-foreground mt-1">{item.milestone}</p>
                                    </div>
                                ) : <div className="hidden md:block">&nbsp;</div>}
                            </div>
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-background border-2 border-primary rounded-full h-8 w-8 items-center justify-center">
                               <Milestone className="h-4 w-4 text-primary mx-auto"/>
                            </div>
                             <div className="md:w-5/12 mt-4 md:mt-0">
                                 {index % 2 !== 0 ? (
                                     <div className="text-left md:pl-8">
                                        <p className="text-primary font-bold">{item.timeline}</p>
                                        <h4 className="text-xl font-bold mt-1">{item.phase}</h4>
                                        <p className="text-muted-foreground mt-1">{item.milestone}</p>
                                    </div>
                                 ) : <div className="hidden md:block">&nbsp;</div>}
                            </div>
                        </div>
                         {/* Mobile view timeline indicator */}
                        <div className="md:hidden mt-2 border-l-2 border-primary pl-4">
                            <p className="text-primary font-bold">{item.timeline}</p>
                            <h4 className="text-xl font-bold mt-1">{item.phase}</h4>
                            <p className="text-muted-foreground mt-1">{item.milestone}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Closing Summary and CTA */}
        <section className="text-center bg-secondary py-12 rounded-lg">
          <h2 className="text-3xl font-bold font-headline">A Sustainable, Yield-Driven Investment</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            INRTX offers a sustainable, yield-driven investment model blending DeFi innovation with traditional asset security. By acquiring INRTX Reserve Tokens, investors gain exposure to a diversified, profit-generating ecosystem that ensures transparency, liquidity, and consistent returns.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/buy">
                Start Earning Yield <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
