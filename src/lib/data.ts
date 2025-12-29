export type Trim = { id: string; name: string };
export type Model = { id:string; name: string; trims: Trim[] };
export type Brand = { id: string; name: string; models: Model[] };
export type CarListing = {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  price: number;
  marketPrice: number;
  mileage: number;
  location: string;
  images: string[];
  specs: {
    origin: string;
    engineCylinders: number;
    fuelType: 'Petrol' | 'Diesel' | 'Hybrid';
    color: string;
    paintCondition: string;
  };
  notes: string;
};

export const carBrands: Brand[] = [
  {
    id: "toyota",
    name: "Toyota",
    models: [
      {
        id: "land-cruiser",
        name: "Land Cruiser",
        trims: [
          { id: "gx", name: "GX" },
          { id: "gxr", name: "GXR" },
          { id: "vx", name: "VX" },
          { id: "vxr", name: "VXR" },
        ],
      },
      {
        id: "camry",
        name: "Camry",
        trims: [
          { id: "le", name: "LE" },
          { id: "se", name: "SE" },
          { id: "xle", name: "XLE" },
          { id: "xse", name: "XSE" },
        ],
      },
    ],
  },
  {
    id: "bmw",
    name: "BMW",
    models: [
      {
        id: "x6",
        name: "X6",
        trims: [
          { id: "xdrive40i", name: "xDrive40i" },
          { id: "m60i", name: "M60i" },
          { id: "m-competition", name: "M Competition" },
        ],
      },
      {
        id: "530i",
        name: "530i",
        trims: [
          { id: "standard", name: "Standard" },
          { id: "msport", name: "M Sport" },
        ],
      },
    ],
  },
  {
    id: "kia",
    name: "Kia",
    models: [
        { id: "sportage", name: "Sportage", trims: [ {id: "lx", name: "LX"}, {id: "ex", name: "EX"}, {id: "sx", name: "SX"} ] },
        { id: "sorento", name: "Sorento", trims: [ {id: "l", name: "L"}, {id: "lx", name: "LX"}, {id: "s", name: "S"} ] }
    ]
  },
];

export const governorates: string[] = [
    "Baghdad",
    "Basra",
    "Erbil",
    "Sulaymaniyah",
    "Duhok",
    "Nineveh",
    "Anbar",
    "Diyala"
];

export const carListings: CarListing[] = [
    {
        id: "1",
        brand: "Toyota",
        model: "Land Cruiser",
        trim: "VXR",
        year: 2023,
        price: 85000,
        marketPrice: 83500,
        mileage: 15000,
        location: "Baghdad, Al-Mansour",
        images: ["car-1", "car-7", "car-8", "car-9", "car-10"],
        specs: {
            origin: "Gulf",
            engineCylinders: 8,
            fuelType: "Petrol",
            color: "White",
            paintCondition: "No paint"
        },
        notes: "Excellent condition, agency maintained. First owner."
    },
    {
        id: "2",
        brand: "BMW",
        model: "530i",
        trim: "M Sport",
        year: 2022,
        price: 62000,
        marketPrice: 60000,
        mileage: 25000,
        location: "Erbil, Dream City",
        images: ["car-2", "car-7", "car-8", "car-9", "car-10"],
        specs: {
            origin: "USA",
            engineCylinders: 4,
            fuelType: "Petrol",
            color: "Black",
            paintCondition: "1 panel"
        },
        notes: "Clean title, minor scratch on front bumper. Imported from USA."
    },
    {
        id: "3",
        brand: "Kia",
        model: "Sportage",
        trim: "SX",
        year: 2024,
        price: 38000,
        marketPrice: 38500,
        mileage: 5000,
        location: "Basra, Al-Ashar",
        images: ["car-3", "car-7", "car-8", "car-9", "car-10"],
        specs: {
            origin: "Local/Agency",
            engineCylinders: 4,
            fuelType: "Petrol",
            color: "Silver",
            paintCondition: "No paint"
        },
        notes: "Almost new, full options with panoramic sunroof."
    },
    {
        id: "4",
        brand: "Toyota",
        model: "Camry",
        trim: "SE",
        year: 2021,
        price: 32000,
        marketPrice: 31000,
        mileage: 60000,
        location: "Sulaymaniyah, Bakhtyari",
        images: ["car-4", "car-7", "car-8", "car-9", "car-10"],
        specs: {
            origin: "Canada",
            engineCylinders: 4,
            fuelType: "Hybrid",
            color: "Red",
            paintCondition: "2 panels"
        },
        notes: "Very economic hybrid engine. Perfect for city driving."
    },
    {
        id: "5",
        brand: "BMW",
        model: "X6",
        trim: "xDrive40i",
        year: 2023,
        price: 95000,
        marketPrice: 93000,
        mileage: 10000,
        location: "Duhok, Malta",
        images: ["car-5", "car-7", "car-8", "car-9", "car-10"],
        specs: {
            origin: "Gulf",
            engineCylinders: 6,
            fuelType: "Petrol",
            color: "Blue",
            paintCondition: "No paint"
        },
        notes: "Stunning blue color, fully loaded. Under warranty."
    }
];
