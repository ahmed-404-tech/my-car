'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { CarListing } from '@/lib/data';
import { negotiatePrice, type NegotiatePriceInput } from '@/ai/flows/ai-negotiation-assistant';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type Message = {
    role: 'user' | 'ai' | 'system';
    content: string;
};

type Props = {
    listing: CarListing;
};

export function NegotiationAssistant({ listing }: Props) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'system', content: `AI assistant is ready to help you negotiate for this ${listing.brand} ${listing.model}. The seller's asking price is $${listing.price}. What's your opening offer?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        try {
            const negotiationHistory = messages.map(m => ({
                 role: m.role === 'user' ? 'buyer' : m.role === 'ai' ? 'seller' : 'ai', // Simulating AI as seller
                 message: m.content,
            }));
            negotiationHistory.push({ role: 'buyer', message: input });

            const carSpecifications = `
                Brand: ${listing.brand}, Model: ${listing.model}, Year: ${listing.year}, 
                Mileage: ${listing.mileage}km, Condition: ${listing.specs.paintCondition}, 
                Origin: ${listing.specs.origin}. ${listing.notes}
            `;

            const aiInput: NegotiatePriceInput = {
                carSpecifications,
                userRole: 'buyer',
                initialPrice: listing.price,
                targetPrice: listing.marketPrice * 0.95, // User wants a good deal
                negotiationHistory,
            };

            const result = await negotiatePrice(aiInput);
            
            setMessages(prev => [...prev, { role: 'ai', content: result.suggestedMessage }]);
            if (result.newPrice) {
                setSuggestedPrice(result.newPrice);
            }
        } catch(error) {
            console.error('Negotiation error:', error);
            setMessages(prev => [...prev, { role: 'system', content: "Sorry, I encountered an error. Please try again." }]);
            toast({
                title: "Negotiation Error",
                description: "The AI assistant is currently unavailable.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>AI Negotiation Assistant</CardTitle>
                <CardDescription>Practice your negotiation skills with our AI. You are the buyer.</CardDescription>
                {suggestedPrice && (
                    <div className="pt-2">
                        <Badge>AI's Current Offer: ${suggestedPrice.toLocaleString()}</Badge>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-end gap-2", 
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}>
                                {message.role === 'ai' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot size={18} /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm", 
                                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 
                                    message.role === 'system' ? 'w-full bg-muted text-center' :
                                    'bg-secondary text-secondary-foreground'
                                )}>
                                    {message.content}
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><User size={18} /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-end gap-2 justify-start">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                                </Avatar>
                                <div className="max-w-[75%] rounded-lg px-3 py-2 bg-secondary text-secondary-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your offer or message..."
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
