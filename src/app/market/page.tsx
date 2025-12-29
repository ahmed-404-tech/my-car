import Image from 'next/image';
import Link from 'next/link';
import { Car, DollarSign, Gauge, MapPin, Tag } from 'lucide-react';
import { carListings } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const formatPrice = (price: number) => `$${price.toLocaleString()}`;

export default function MarketPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="text-center md:text-left">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-primary">
            Car Market
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Find your next car or list yours for sale.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/market/new">
            <DollarSign className="mr-2 h-5 w-5" />
            Sell Your Car
          </Link>
        </Button>
      </header>
      
      {/* Filters would go here in a real app */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carListings.map((listing) => {
          const placeholder = PlaceHolderImages.find(p => p.id === listing.images[0]);
          return (
            <Link href={`/market/${listing.id}`} key={listing.id} className="group block">
              <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <CardHeader className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {placeholder && (
                      <Image
                        src={placeholder.imageUrl}
                        alt={`${listing.brand} ${listing.model}`}
                        data-ai-hint={placeholder.imageHint}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                     <Badge variant="secondary" className="absolute top-3 right-3">{listing.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                   <CardTitle className="font-headline text-xl font-bold text-primary truncate">
                    {listing.brand} {listing.model} {listing.trim}
                  </CardTitle>
                  <p className="text-2xl font-bold text-accent mt-2">{formatPrice(listing.price)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>{listing.specs.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>{listing.specs.paintCondition}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        <span>{listing.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location.split(',')[0]}</span>
                    </div>
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
