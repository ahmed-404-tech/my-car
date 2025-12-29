import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

const featureCards = [
  {
    title: 'Car Price Estimation',
    description: 'Get an accurate market value for your car.',
    href: '/estimate',
    imgId: 'home-hero-estimate',
  },
  {
    title: 'Buy / Sell Cars',
    description: 'Browse listings or sell your car with ease.',
    href: '/market',
    imgId: 'home-hero-buy-sell',
  },
  {
    title: 'Trader Market',
    description: 'Access exclusive market insights and data.',
    href: '/insights',
    imgId: 'home-hero-trader',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <header className="text-center mb-12 md:mb-20">
        <div className="inline-block mb-4">
          <Logo className="h-16 w-16 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-primary">
          Seyarati Beish
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Your expert guide to the Iraqi car market. Estimate, buy, sell, and analyze with confidence.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {featureCards.map((feature) => {
          const placeholder = PlaceHolderImages.find(p => p.id === feature.imgId);
          return (
            <Link href={feature.href} key={feature.title} className="group block">
              <Card className="h-full transform transition-all duration-300 ease-in-out group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/20">
                <CardHeader>
                  <div className="aspect-[3/2] relative mb-4 overflow-hidden rounded-lg">
                    {placeholder && (
                        <Image
                            src={placeholder.imageUrl}
                            alt={placeholder.description}
                            data-ai-hint={placeholder.imageHint}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                  </div>
                  <CardTitle className="font-headline text-2xl font-bold text-primary">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex items-center font-semibold text-accent group-hover:text-primary">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
