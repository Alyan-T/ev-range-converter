import { RangeValues } from "./range";

export interface PakistanAvailability {
  available: boolean;
  priceFormatted: string | null;
  pricePkr?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant?: string;
  trim?: string; // keeping trim for backward compatibility
  year: number;
  bodyStyle?: "Sedan" | "SUV" | "Hatchback" | "Crossover" | "Truck";
  batteryKwh: number;
  ranges: RangeValues;
  isDemoData?: boolean;
  isHot?: boolean;
  
  // New features for Pakistan market
  pakistan: PakistanAvailability;
  source: string;
  lastVerified: string;
  image?: string;
}
