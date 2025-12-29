'use client';

import { Send, User, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function MessagingSimulation() {
    const messages = [
        { role: 'seller', content: 'Hello, the car is available for viewing. Let me know when you are free.' },
        { role: 'user', content: 'Great, thank you! Would tomorrow afternoon work for you?' },
        { role: 'seller', content: 'Yes, 3 PM at my location works perfectly.' },
    ];

    return (
         <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>Direct Message with Seller</CardTitle>
                <CardDescription>This is a UI demonstration. Messaging is not functional in this MVP.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-end gap-2", 
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}>
                                {message.role === 'seller' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><User size={18} /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm", 
                                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                                )}>
                                    {message.content}
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-8 w-8 bg-accent">
                                        <AvatarFallback className="text-accent-foreground">You</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-center space-x-2">
                    <Input
                        placeholder="Messaging disabled in demo"
                        disabled
                    />
                    <Button type="submit" size="icon" disabled>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
