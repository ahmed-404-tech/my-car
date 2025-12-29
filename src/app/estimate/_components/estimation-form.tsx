"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Car, Upload, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { carBrands, governorates } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  // Step 1
  brand: z.string().min(1, "Car brand is required."),
  model: z.string().min(1, "Car model is required."),
  trim: z.string().min(1, "Car trim is required."),
  year: z.coerce.number().min(1980, "Invalid year.").max(new Date().getFullYear() + 1, "Invalid year."),
  origin: z.string().min(1, "Import origin is required."),
  fuelType: z.enum(["Petrol", "Diesel", "Hybrid"]),
  cylinders: z.enum(["4", "6", "8"]),

  // Step 2
  color: z.string().min(1, "Color is required."),
  paint: z.string().min(1, "Paint condition is required."),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative."),
  image: z.any().refine(file => file?.length == 1, "Car image is required."),
  location: z.string().min(1, "Location is required."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

async function estimatePriceAction(data: FormValues) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate AI/database calculation
    const basePrice = 40000 - (new Date().getFullYear() - data.year) * 1500 - (data.mileage / 1000);
    const minPrice = basePrice * 0.85;
    const avgPrice = basePrice * 1.0;
    const maxPrice = basePrice * 1.15;
    const daysToSell = Math.round(Math.random() * 20) + 10;

    const params = new URLSearchParams({
        min: Math.round(minPrice / 100) * 100,
        avg: Math.round(avgPrice / 100) * 100,
        max: Math.round(maxPrice / 100) * 100,
        days: daysToSell,
    });
    
    return `/estimate/result?${params.toString()}`;
}


export function EstimationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      trim: "",
      year: new Date().getFullYear(),
      origin: "",
      fuelType: "Petrol",
      cylinders: "4",
      color: "",
      paint: "",
      mileage: 0,
      image: undefined,
      location: "",
      notes: "",
    },
  });

  const selectedBrandName = form.watch("brand");
  const selectedBrand = carBrands.find((b) => b.name === selectedBrandName);
  const selectedModelName = form.watch("model");
  const selectedModel = selectedBrand?.models.find((m) => m.name === selectedModelName);
  
  const handleNextStep = async () => {
    const isValid = await form.trigger(["brand", "model", "trim", "year", "origin", "fuelType", "cylinders"]);
    if (isValid) {
      setStep(2);
    }
  };
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
        const resultUrl = await estimatePriceAction(data);
        router.push(resultUrl);
    } catch (error) {
        toast({
            title: "Estimation Failed",
            description: "An error occurred while estimating the price. Please try again.",
            variant: "destructive"
        })
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Step {step} of 2</CardTitle>
        <CardDescription>
          {step === 1 ? "Provide the core specifications of your car." : "Add final details to refine your estimate."}
        </CardDescription>
        <Progress value={step * 50} className="mt-2" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Brand</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('model', '');
                          form.setValue('trim', '');
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carBrands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.name}>{brand.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Model</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('trim', '');
                      }} value={field.value} disabled={!selectedBrand}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedBrand?.models.map((model) => (
                            <SelectItem key={model.id} value={model.name}>{model.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Trim/Variant</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedModel}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a trim" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedModel?.trims.map((trim) => (
                            <SelectItem key={trim.id} value={trim.name}>{trim.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Year</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Import Origin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an origin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['USA', 'Canada', 'Gulf', 'Local/Agency'].map(origin => (
                              <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Fuel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['Petrol', 'Diesel', 'Hybrid'].map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cylinders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cylinders</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Cyl." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['4', '6', '8'].map(cyl => (
                              <SelectItem key={cyl} value={cyl}>{cyl}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a color" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['White', 'Black', 'Silver', 'Blue', 'Red', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paint Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select paint condition" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['No paint', '1 panel', '2 panels', '3 panels', '4 panels', 'Full paint'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage (in kilometers)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 55000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Location</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a governorate" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {governorates.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...rest }}) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Car Image</FormLabel>
                        <FormControl>
                            <Input id="picture" type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...rest} />
                        </FormControl>
                        <FormDescription>Upload at least one image of your car.</FormDescription>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Special features, known issues..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <div></div>
            ) : (
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}

            {step === 1 ? (
              <Button type="button" onClick={handleNextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Car className="mr-2 h-4 w-4" />
                )}
                Estimate My Car Price
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
