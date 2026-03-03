import type { Vehicle } from "./in-memory";

function uuid() {
  return crypto.randomUUID();
}

function v(
  make: string,
  model: string,
  year: number,
  category: Vehicle["category"],
  condition: Vehicle["condition"],
  base_price: number,
  color: string,
  mileage: number,
  features: string[],
): Vehicle {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    make,
    model,
    year,
    category,
    condition,
    base_price,
    color,
    mileage,
    features,
    image_url: null,
    vin: null,
    status: "available",
    created_at: now,
    updated_at: now,
  };
}

// ============================================================
//  AutoElite Motors — Full BMW Inventory
//  ~50 vehicles: new, certified pre-owned, and used
// ============================================================

export const SEED_VEHICLES: Vehicle[] = [
  // ────────────────────────────────────────────────────────────
  //  NEW 2025
  // ────────────────────────────────────────────────────────────

  // --- Sedans ---
  v("BMW", "330i Sedan", 2025, "sedan", "new", 44900, "Mineral White", 0, [
    "M Sport Package", "Heated Front Seats", "Panoramic Moonroof",
    "Wireless Charging", "Live Cockpit Professional", "18-inch Wheels",
    "Apple CarPlay", "Comfort Access",
  ]),
  v("BMW", "M340i xDrive Sedan", 2025, "sedan", "new", 58200, "Portimao Blue", 0, [
    "M Sport Package", "M Sport Differential", "Adaptive M Suspension",
    "Harman Kardon Surround Sound", "Head-Up Display", "Heated Front Seats",
    "Heated Steering Wheel", "19-inch M Wheels", "Shadowline Trim",
  ]),
  v("BMW", "M3 Competition xDrive", 2025, "sedan", "new", 79900, "Frozen Portimao Blue", 0, [
    "M Carbon Ceramic Brakes", "M Sport Exhaust", "M Adaptive Suspension",
    "M Carbon Bucket Seats", "Harman Kardon Surround Sound", "Head-Up Display",
    "Laser Light", "19/20-inch Staggered M Wheels", "M Drive Professional",
  ]),
  v("BMW", "530i xDrive Sedan", 2025, "sedan", "new", 58900, "Alpine White", 0, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Head-Up Display",
    "Driving Assistance Professional", "Comfort Access", "19-inch Wheels",
  ]),
  v("BMW", "540i xDrive Sedan", 2025, "sedan", "new", 68900, "Tanzanite Blue", 0, [
    "Executive Package", "Ventilated Front Seats", "Soft-Close Doors",
    "4-Zone Climate Control", "Bowers & Wilkins Diamond Sound",
    "Head-Up Display", "Driving Assistance Professional",
    "Parking Assistance Package", "20-inch Wheels",
  ]),
  v("BMW", "M5 Sedan", 2025, "sedan", "new", 112800, "Fire Red", 0, [
    "M Carbon Ceramic Brakes", "M Driver's Package", "M Sport Exhaust",
    "Bowers & Wilkins Diamond Sound", "Head-Up Display",
    "Ventilated Front Seats", "Soft-Close Doors", "Laser Light",
    "20-inch M Forged Wheels",
  ]),
  v("BMW", "740i xDrive", 2025, "sedan", "new", 97300, "Dravit Grey", 0, [
    "Executive Package", "Sky Lounge Panoramic LED Roof",
    "Bowers & Wilkins Diamond Sound", "Rear Seat Entertainment",
    "Massage Front Seats", "Ventilated Front & Rear Seats",
    "Driving Assistance Professional", "Soft-Close Doors", "21-inch Wheels",
  ]),
  v("BMW", "i4 eDrive40 Gran Coupe", 2025, "sedan", "new", 56200, "Skyscraper Grey", 0, [
    "Fully Electric", "301-Mile Range", "M Sport Package",
    "Harman Kardon Surround Sound", "Heated Front Seats",
    "Driving Assistance Professional", "Head-Up Display", "19-inch Wheels",
  ]),
  v("BMW", "i5 M60 xDrive", 2025, "sedan", "new", 84100, "Frozen Deep Grey", 0, [
    "Fully Electric", "256-Mile Range", "M Sport Package",
    "Bowers & Wilkins Diamond Sound", "Head-Up Display",
    "Ventilated Front Seats", "Soft-Close Doors",
    "Driving Assistance Professional", "21-inch M Wheels",
  ]),

  // --- SUVs ---
  v("BMW", "X1 xDrive28i", 2025, "suv", "new", 42600, "Phytonic Blue", 0, [
    "M Sport Package", "Heated Front Seats", "Panoramic Moonroof",
    "Wireless Charging", "Live Cockpit Professional",
    "Driving Assistance Package", "Power Tailgate", "19-inch Wheels",
  ]),
  v("BMW", "X3 xDrive30i", 2025, "suv", "new", 50200, "Alpine White", 0, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Head-Up Display", "Wireless Charging",
    "Power Tailgate", "Comfort Access", "19-inch Wheels",
  ]),
  v("BMW", "X3 M40i", 2025, "suv", "new", 62300, "Brooklyn Grey", 0, [
    "M Sport Package", "M Sport Differential", "Adaptive M Suspension",
    "Harman Kardon Surround Sound", "Head-Up Display", "Heated Front Seats",
    "Heated Steering Wheel", "Shadowline Trim", "21-inch M Wheels",
  ]),
  v("BMW", "X5 xDrive40i", 2025, "suv", "new", 67400, "Carbon Black", 0, [
    "Premium Package", "Heated Front & Rear Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Head-Up Display",
    "Driving Assistance Professional", "Tow Hitch", "Power Tailgate",
    "20-inch Wheels",
  ]),
  v("BMW", "X5 xDrive50e", 2025, "suv", "new", 75900, "Mineral White", 0, [
    "Plug-In Hybrid", "M Sport Package", "Executive Package",
    "Ventilated Front Seats", "Bowers & Wilkins Diamond Sound",
    "Head-Up Display", "Soft-Close Doors",
    "Driving Assistance Professional", "Tow Hitch", "21-inch Wheels",
  ]),
  v("BMW", "X7 xDrive40i", 2025, "suv", "new", 82800, "Arctic Grey", 0, [
    "3rd Row Seating", "6-Passenger Configuration",
    "Sky Lounge Panoramic LED Roof", "Harman Kardon Surround Sound",
    "Head-Up Display", "Heated Front & 2nd Row Seats",
    "Driving Assistance Professional", "Tow Hitch", "Power Tailgate",
    "5-Zone Climate Control", "21-inch Wheels",
  ]),
  v("BMW", "X7 M60i", 2025, "suv", "new", 106900, "Tanzanite Blue", 0, [
    "3rd Row Seating", "6-Passenger Configuration",
    "Bowers & Wilkins Diamond Sound", "Sky Lounge Panoramic LED Roof",
    "Ventilated Front Seats", "Massage Front Seats", "Night Vision",
    "Rear Seat Entertainment", "Soft-Close Doors", "Tow Hitch",
    "5-Zone Climate Control", "22-inch M Wheels",
  ]),
  v("BMW", "iX xDrive50", 2025, "suv", "new", 87100, "Oxide Grey", 0, [
    "Fully Electric", "324-Mile Range", "Bowers & Wilkins Diamond Sound",
    "Panoramic Glass Roof", "Head-Up Display",
    "Driving Assistance Professional", "Heated Front & Rear Seats",
    "Gesture Control", "22-inch Wheels",
  ]),

  // --- Coupes ---
  v("BMW", "230i Coupe", 2025, "coupe", "new", 39900, "Alpine White", 0, [
    "M Sport Package", "8-Speed Sport Automatic", "Heated Front Seats",
    "Wireless Charging", "Live Cockpit Professional", "18-inch M Wheels",
  ]),
  v("BMW", "M240i xDrive Coupe", 2025, "coupe", "new", 50550, "Thundernight", 0, [
    "M Sport Package", "Adaptive M Suspension", "Harman Kardon Surround Sound",
    "Head-Up Display", "Heated Front Seats", "Wireless Charging",
    "M Sport Differential", "19-inch M Wheels",
  ]),
  v("BMW", "430i Coupe", 2025, "coupe", "new", 50100, "Black Sapphire", 0, [
    "M Sport Package", "Heated Front Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Ambient Lighting",
    "Wireless Charging", "19-inch Wheels",
  ]),
  v("BMW", "M4 Competition xDrive", 2025, "coupe", "new", 84100, "Isle of Man Green", 0, [
    "M Carbon Bucket Seats", "M Carbon Roof", "M Adaptive Suspension",
    "M Sport Exhaust", "M Drive Professional", "Harman Kardon Surround Sound",
    "Head-Up Display", "Laser Light", "19/20-inch Staggered M Wheels",
  ]),

  // --- Convertibles ---
  v("BMW", "430i Convertible", 2025, "convertible", "new", 56800, "Tanzanite Blue", 0, [
    "M Sport Package", "Heated Front Seats", "Harman Kardon Surround Sound",
    "Neck Warmer", "Head-Up Display", "Driving Assistance Package",
    "19-inch Wheels",
  ]),

  // ────────────────────────────────────────────────────────────
  //  CERTIFIED PRE-OWNED (2023–2024)
  // ────────────────────────────────────────────────────────────

  // --- Sedans ---
  v("BMW", "228i Gran Coupe", 2024, "sedan", "certified-pre-owned", 32500, "Alpine White", 12400, [
    "M Sport Package", "Heated Front Seats", "Wireless Charging",
    "Navigation", "18-inch M Wheels", "Apple CarPlay",
  ]),
  v("BMW", "330i Sedan", 2024, "sedan", "certified-pre-owned", 37800, "Mineral White", 14200, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Wireless Charging", "Comfort Access", "18-inch Wheels",
  ]),
  v("BMW", "M340i xDrive Sedan", 2023, "sedan", "certified-pre-owned", 48900, "Portimao Blue", 22100, [
    "M Sport Package", "M Sport Differential", "Harman Kardon Surround Sound",
    "Head-Up Display", "Heated Front Seats", "19-inch M Wheels",
  ]),
  v("BMW", "430i Gran Coupe", 2024, "sedan", "certified-pre-owned", 42500, "Black Sapphire", 9800, [
    "M Sport Package", "Heated Front Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Ambient Lighting", "19-inch Wheels",
  ]),
  v("BMW", "530i xDrive Sedan", 2024, "sedan", "certified-pre-owned", 48200, "Alpine White", 11300, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Comfort Access", "19-inch Wheels",
  ]),
  v("BMW", "540i xDrive Sedan", 2023, "sedan", "certified-pre-owned", 52800, "Tanzanite Blue", 18500, [
    "Executive Package", "Ventilated Front Seats",
    "Bowers & Wilkins Diamond Sound", "Head-Up Display",
    "Soft-Close Doors", "20-inch Wheels",
  ]),
  v("BMW", "840i Gran Coupe", 2024, "sedan", "certified-pre-owned", 72500, "Dravit Grey", 12800, [
    "M Sport Package", "Bowers & Wilkins Diamond Sound", "Head-Up Display",
    "Ventilated Front Seats", "Soft-Close Doors", "Ambient Lighting",
    "20-inch M Wheels",
  ]),
  v("BMW", "i4 eDrive40 Gran Coupe", 2024, "sedan", "certified-pre-owned", 44200, "Skyscraper Grey", 7200, [
    "Fully Electric", "301-Mile Range", "M Sport Package",
    "Harman Kardon Surround Sound", "Heated Front Seats", "19-inch Wheels",
  ]),

  // --- SUVs ---
  v("BMW", "X1 sDrive28i", 2024, "suv", "certified-pre-owned", 35200, "Phytonic Blue", 8400, [
    "M Sport Package", "Heated Front Seats", "Panoramic Moonroof",
    "Power Tailgate", "19-inch Wheels",
  ]),
  v("BMW", "X3 xDrive30i", 2024, "suv", "certified-pre-owned", 42100, "Brooklyn Grey", 10600, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Power Tailgate", "19-inch Wheels",
  ]),
  v("BMW", "X5 xDrive40i", 2024, "suv", "certified-pre-owned", 58900, "Carbon Black", 15200, [
    "Premium Package", "Heated Front & Rear Seats", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Tow Hitch",
    "Driving Assistance Professional", "20-inch Wheels",
  ]),
  v("BMW", "X5 xDrive40i", 2023, "suv", "certified-pre-owned", 52300, "Alpine White", 24500, [
    "M Sport Package", "Heated Front Seats", "Head-Up Display",
    "Harman Kardon Surround Sound", "Tow Hitch", "20-inch M Wheels",
  ]),
  v("BMW", "X7 xDrive40i", 2023, "suv", "certified-pre-owned", 68900, "Arctic Grey", 19800, [
    "3rd Row Seating", "6-Passenger Configuration", "Panoramic Moonroof",
    "Harman Kardon Surround Sound", "Heated Front & 2nd Row Seats",
    "Tow Hitch", "21-inch Wheels",
  ]),

  // --- Coupes & Convertibles ---
  v("BMW", "M2", 2024, "coupe", "certified-pre-owned", 58500, "Zandvoort Blue", 5100, [
    "M Sport Exhaust", "M Adaptive Suspension",
    "Harman Kardon Surround Sound", "Heated M Sport Seats",
    "Head-Up Display", "19-inch M Wheels",
  ]),
  v("BMW", "Z4 M40i", 2024, "convertible", "certified-pre-owned", 55800, "San Remo Green", 6300, [
    "M Sport Package", "Adaptive M Suspension",
    "Harman Kardon Surround Sound", "Heated Front Seats",
    "Head-Up Display", "19-inch M Wheels",
  ]),

  // ────────────────────────────────────────────────────────────
  //  USED (2021–2023)
  // ────────────────────────────────────────────────────────────

  // --- Sedans ---
  v("BMW", "330i Sedan", 2022, "sedan", "used", 29500, "Alpine White", 35200, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "18-inch Wheels", "Apple CarPlay",
  ]),
  v("BMW", "330i Sedan", 2021, "sedan", "used", 26800, "Black Sapphire", 42100, [
    "M Sport Package", "Heated Front Seats", "Wireless Charging",
    "19-inch M Wheels",
  ]),
  v("BMW", "M340i xDrive Sedan", 2022, "sedan", "used", 42500, "Brooklyn Grey", 28400, [
    "M Sport Differential", "Harman Kardon Surround Sound",
    "Head-Up Display", "Heated Front Seats", "19-inch M Wheels",
  ]),
  v("BMW", "530i xDrive Sedan", 2022, "sedan", "used", 38900, "Mineral White", 32100, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Comfort Access", "19-inch Wheels",
  ]),
  v("BMW", "740i xDrive", 2022, "sedan", "used", 62500, "Dravit Grey", 27300, [
    "Executive Package", "Bowers & Wilkins Diamond Sound",
    "Panoramic Moonroof", "Massage Front Seats",
    "Rear Seat Entertainment", "20-inch Wheels",
  ]),

  // --- SUVs ---
  v("BMW", "X3 sDrive30i", 2022, "suv", "used", 34200, "Phytonic Blue", 29800, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Power Tailgate", "19-inch Wheels",
  ]),
  v("BMW", "X3 M40i", 2022, "suv", "used", 46800, "Carbon Black", 25400, [
    "M Sport Package", "M Sport Differential",
    "Harman Kardon Surround Sound", "Head-Up Display", "21-inch M Wheels",
  ]),
  v("BMW", "X5 xDrive40i", 2022, "suv", "used", 48500, "Alpine White", 31200, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Tow Hitch", "Harman Kardon Surround Sound", "20-inch Wheels",
  ]),
  v("BMW", "X5 xDrive45e", 2021, "suv", "used", 42800, "Black Sapphire", 38600, [
    "Plug-In Hybrid", "M Sport Package", "Heated Front Seats",
    "Panoramic Moonroof", "Tow Hitch", "20-inch M Wheels",
  ]),
  v("BMW", "X3 xDrive30i", 2023, "suv", "used", 38500, "Alpine White", 21200, [
    "Premium Package", "Heated Front Seats", "Panoramic Moonroof",
    "Power Tailgate", "Comfort Access", "19-inch Wheels",
  ]),
  v("BMW", "iX xDrive50", 2023, "suv", "used", 58900, "Oxide Grey", 16400, [
    "Fully Electric", "324-Mile Range", "Bowers & Wilkins Diamond Sound",
    "Panoramic Glass Roof", "Heated Front & Rear Seats", "22-inch Wheels",
  ]),

  // --- Coupes & Convertibles ---
  v("BMW", "430i Convertible", 2022, "convertible", "used", 38200, "Tanzanite Blue", 22500, [
    "M Sport Package", "Heated Front Seats",
    "Harman Kardon Surround Sound", "Neck Warmer", "19-inch Wheels",
  ]),
  v("BMW", "M4 Competition", 2023, "coupe", "used", 68900, "Toronto Red", 12800, [
    "M Carbon Bucket Seats", "M Carbon Roof", "M Sport Exhaust",
    "M Adaptive Suspension", "Head-Up Display",
    "19/20-inch Staggered M Wheels",
  ]),
];
