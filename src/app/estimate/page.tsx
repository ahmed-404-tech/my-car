import { EstimationForm } from "./_components/estimation-form";

export default function EstimatePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-primary">
          Car Price Estimation
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Fill out the details below to get an instant, data-driven market valuation for your car.
        </p>
      </header>
      <EstimationForm />
    </div>
  );
}
