import { Logo } from "./logo";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Logo className="h-6 w-6" />
            <span className="font-bold font-headline text-lg">Seyarati Beish</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Seyarati Beish. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
