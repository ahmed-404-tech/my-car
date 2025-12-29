import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Car, Palette, Calendar, Gauge, MapPin, Wrench, Droplets, Text } from 'lucide-react';
import { carListings } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NegotiationAssistant } from './_components/negotiation-assistant';
import { MessagingSimulation } from './_components/messaging-simulation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = carListings.find(l => l.id === params.id);

  if (!listing) {
    notFound();
  }
  
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const specItems = [
    { icon: Car, label: 'Origin', value: listing.specs.origin },
    { icon: Palette, label: 'Color', value: listing.specs.color },
    { icon: Wrench, label: 'Engine', value: `${listing.specs.engineCylinders}-Cylinder ${listing.specs.fuelType}` },
    { icon: Droplets, label: 'Paint', value: listing.specs.paintCondition },
    { icon: Gauge, label: 'Mileage', value: `${listing.mileage.toLocaleString()} km` },
    { icon: MapPin, label: 'Location', value: listing.location },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
               <Carousel className="w-full">
                  <CarouselContent>
                    {listing.images.map((imgId, index) => {
                      const placeholder = PlaceHolderImages.find(p => p.id === imgId);
                      return placeholder ? (
                        <CarouselItem key={index}>
                          <div className="aspect-video relative">
                            <Image
                              src={placeholder.imageUrl}
                              alt={`${listing.brand} ${listing.model} image ${index + 1}`}
                              data-ai-hint={placeholder.imageHint}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ) : null
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
            </CardContent>
          </Card>

          <Card className="mt-6">
              <CardHeader>
                  <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">{listing.notes}</p>
              </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-3xl font-bold text-primary">
                                {listing.brand} {listing.model}
                            </CardTitle>
                            <p className="text-lg text-muted-foreground">{listing.trim}</p>
                        </div>
                        <Badge variant="secondary" className="text-lg">{listing.year}</Badge>
                    </div>
                    <p className="text-4xl font-bold text-accent pt-4">{formatPrice(listing.price)}</p>
                    <p className="text-sm text-muted-foreground">Est. Market Price: {formatPrice(listing.marketPrice)}</p>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                        {specItems.map(item => (
                            <div key={item.label} className="flex items-start space-x-3">
                                <item.icon className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6">
                 <Tabs defaultValue="negotiate" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="negotiate">AI Negotiator</TabsTrigger>
                        <TabsTrigger value="message">Message Seller</TabsTrigger>
                    </TabsList>
                    <TabsContent value="negotiate">
                         <NegotiationAssistant listing={listing} />
                    </TabsContent>
                    <TabsContent value="message">
                        <MessagingSimulation />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
    </div>
  );
}
