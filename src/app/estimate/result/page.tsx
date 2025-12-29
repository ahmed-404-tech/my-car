'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, DollarSign } from 'lucide-react';

function EstimationResultContent() {
    const searchParams = useSearchParams();

    const min = searchParams.get('min');
    const avg = searchParams.get('avg');
    const max = searchParams.get('max');
    const days = searchParams.get('days');

    const formatPrice = (price: string | null) => {
        if (!price) return 'N/A';
        return `$${parseInt(price).toLocaleString()}`;
    }

    if (!min || !avg || !max || !days) {
        return (
            <div className="text-center">
                <p className="text-destructive text-lg">Could not retrieve estimation results.</p>
                <Button asChild className="mt-4">
                    <Link href="/estimate">Try Again</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
                <Card className="border-orange-500/50 bg-orange-500/5 dark:bg-orange-500/10">
                    <CardHeader>
                        <CardTitle className="text-orange-600 dark:text-orange-400">Minimum Price</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-4xl font-bold text-orange-700 dark:text-orange-300">{formatPrice(min)}</p>
                        <p className="text-sm text-muted-foreground mt-2">The lowest expected price in the current market.</p>
                    </CardContent>
                </Card>
                <Card className="border-accent/50 bg-accent/5 dark:bg-accent/10 border-2 shadow-lg scale-105">
                    <CardHeader>
                        <CardTitle className="text-accent-foreground">Average Price</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-5xl font-bold text-primary">{formatPrice(avg)}</p>
                        <p className="text-sm text-muted-foreground mt-2">The most likely selling price for your car.</p>
                    </CardContent>
                </Card>
                <Card className="border-green-500/50 bg-green-500/5 dark:bg-green-500/10">
                    <CardHeader>
                        <CardTitle className="text-green-600 dark:text-green-400">Maximum Price</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-4xl font-bold text-green-700 dark:text-green-300">{formatPrice(max)}</p>
                        <p className="text-sm text-muted-foreground mt-2">The highest price you could achieve with a great deal.</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="w-full max-w-lg mb-8">
                <CardContent className="pt-6 flex items-center justify-center space-x-4">
                    <CalendarDays className="h-10 w-10 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Estimated Time to Sell</p>
                        <p className="text-2xl font-bold text-foreground">{days} days</p>
                    </div>
                </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center max-w-xl mb-8">
                *All prices are approximate and based on available market data. Actual selling price may vary.
            </p>

            <div className="flex space-x-4">
                <Button asChild variant="outline">
                    <Link href="/estimate">Estimate Another Car</Link>
                </Button>
                <Button asChild>
                    <Link href="/market/new">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Sell Your Car Now
                    </Link>
                </Button>
            </div>
        </div>
    );
}


export default function EstimateResultPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-primary">
          Your Car Valuation
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Here is the estimated market value for your vehicle.
        </p>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <EstimationResultContent />
      </Suspense>
    </div>
  );
}
