'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/estimate", label: "Estimate" },
    { href: "/market", label: "Market" },
    { href: "/insights", label: "Insights" },
];

export function Header() {
    const pathname = usePathname();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Logo className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block font-headline">
                            Seyarati Beish
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                             <Link
                                key={link.href}
                                href={link.href}
                                className={cn("transition-colors hover:text-foreground/80",
                                pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
                    <Link href="/" className="flex items-center space-x-2">
                         <Logo className="h-6 w-6" />
                        <span className="font-bold font-headline">
                            Seyarati Beish
                        </span>
                    </Link>
                </div>


                <div className="flex items-center justify-end flex-1">
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col space-y-4 mt-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn("text-lg font-medium transition-colors hover:text-foreground/80",
                                    pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
