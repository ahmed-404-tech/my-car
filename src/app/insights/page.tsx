'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { carBrands, governorates } from '@/lib/data';
import type { MarketInsightOutput } from '@/ai/flows/market-insight-generator';
import { generateMarketInsights } from '@/ai/flows/market-insight-generator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const insightsSchema = z.object({
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    trim: z.string().min(1, 'Trim is required'),
    location: z.string().min(1, 'Location is required'),
});
type InsightsFormValues = z.infer<typeof insightsSchema>;

function InsightsDisplay({ insights, isLoading }: { insights: MarketInsightOutput | null, isLoading: boolean }) {
    const statCards = [
        { label: 'Active Listings', value: insights?.activeListings },
        { label: 'Avg. Selling Time', value: insights?.averageSellingTime },
        { label: 'Supply/Demand Ratio', value: insights?.supplyDemandRatio },
    ];
    
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
                        <CardContent><Skeleton className="h-8 w-1/3" /></CardContent>
                    </Card>
                ))}
                <Card className="md:col-span-3 lg:col-span-2">
                    <CardHeader><Skeleton className="h-5 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-12 w-full" /></CardContent>
                </Card>
                 <Card className="md:col-span-3 lg:col-span-1">
                    <CardHeader><Skeleton className="h-5 w-1/2" /></CardHeader>
                    <CardContent><Skeleton className="h-12 w-full" /></CardContent>
                </Card>
            </div>
        );
    }
    
    if (!insights) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map(stat => (
                <Card key={stat.label}>
                    <CardHeader>
                        <CardTitle className="text-md font-medium text-muted-foreground">{stat.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </CardContent>
                </Card>
            ))}
            <Card className="md:col-span-3 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-md font-medium text-muted-foreground">Expected Market Price</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{insights.expectedMarketPrice}</p>
                </CardContent>
            </Card>
            <Card className="md:col-span-3 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-md font-medium text-muted-foreground">High Demand Areas</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold">{insights.highDemandAreas}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function InsightsPage() {
    const [insights, setInsights] = useState<MarketInsightOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<InsightsFormValues>({
        resolver: zodResolver(insightsSchema),
        defaultValues: { brand: '', model: '', trim: '', location: '' },
    });
    
    const selectedBrandName = form.watch("brand");
    const selectedBrand = carBrands.find((b) => b.name === selectedBrandName);
    const selectedModelName = form.watch("model");
    const selectedModel = selectedBrand?.models.find((m) => m.name === selectedModelName);
    
    const onSubmit = async (values: InsightsFormValues) => {
        setIsLoading(true);
        setError(null);
        setInsights(null);
        try {
            const result = await generateMarketInsights({
                carBrand: values.brand,
                carModel: values.model,
                carTrim: values.trim,
                location: values.location,
            });
            setInsights(result);
        } catch (e) {
            setError("Failed to generate market insights. The AI service may be temporarily unavailable.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="text-center mb-8">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-primary">
                    Trader Market Insights
                </h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Unlock powerful data-driven insights for the Iraqi car market.
                </p>
            </header>

            <Card className="max-w-5xl mx-auto mb-12">
                <CardHeader>
                    <CardTitle>Generate Insights</CardTitle>
                    <CardDescription>Select your criteria to get detailed market analysis.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <FormField control={form.control} name="brand" render={({ field }) => (
                                    <FormItem className="lg:col-span-1">
                                        <FormLabel>Brand</FormLabel>
                                        <Select onValueChange={(value) => { field.onChange(value); form.setValue('model', ''); form.setValue('trim', ''); }} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger></FormControl>
                                            <SelectContent>{carBrands.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField control={form.control} name="model" render={({ field }) => (
                                    <FormItem className="lg:col-span-1">
                                        <FormLabel>Model</FormLabel>
                                        <Select onValueChange={(value) => { field.onChange(value); form.setValue('trim', ''); }} value={field.value} disabled={!selectedBrand}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Model" /></SelectTrigger></FormControl>
                                            <SelectContent>{selectedBrand?.models.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="trim" render={({ field }) => (
                                    <FormItem className="lg:col-span-1">
                                        <FormLabel>Trim</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedModel}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Trim" /></SelectTrigger></FormControl>
                                            <SelectContent>{selectedModel?.trims.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="location" render={({ field }) => (
                                    <FormItem className="lg:col-span-1">
                                        <FormLabel>Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger></FormControl>
                                            <SelectContent>{governorates.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <div className="lg:col-span-1 flex items-end">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                        Analyze
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </form>
                </Form>
            </Card>

            <section className="max-w-5xl mx-auto">
                 {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <InsightsDisplay insights={insights} isLoading={isLoading} />
                 { !insights && !isLoading && !error && (
                     <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium text-muted-foreground">Your market insights will appear here.</h3>
                        <p className="text-sm text-muted-foreground">Fill out the form above to get started.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
