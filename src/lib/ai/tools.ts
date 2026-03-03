import { z } from "zod";
import { tool } from "ai";
import { store } from "@/lib/store/in-memory";

export function createTools(leadId: string, _conversationId: string) {
  return {
    recommendVehicle: tool({
      description:
        "Search the BMW inventory to find matching vehicles. Call this when you have enough context about what the customer wants. If they ask for 'used' cars, pass condition 'used' — it will include both pre-owned and certified pre-owned results automatically.",
      inputSchema: z.object({
        category: z.string().optional().describe("Body style: sedan, suv, coupe, convertible"),
        condition: z.enum(["new", "used"]).optional().describe("'new' for new only, 'used' for all pre-owned including certified"),
        min_price: z.number().optional().describe("Minimum price in USD"),
        max_price: z.number().optional().describe("Maximum price in USD"),
        make: z.string().optional().describe("Brand — almost always BMW for our lot"),
        model: z.string().optional().describe("Model name or partial match, e.g. 'X5', '3 Series', 'M4', 'i4'"),
      }),
      execute: async (params) => {
        const vehicles = store.queryVehicles(params);

        if (vehicles.length === 0) {
          return {
            success: true,
            vehicles: [],
            message: "No matching vehicles found. Try broadening the search criteria.",
          };
        }

        return {
          success: true,
          vehicles: vehicles.map((v) => ({
            id: v.id,
            make: v.make,
            model: v.model,
            year: v.year,
            category: v.category,
            condition: v.condition,
            price: v.base_price,
            color: v.color,
            mileage: v.mileage,
            features: v.features,
            image_url: v.image_url,
          })),
        };
      },
    }),

    scheduleAppointment: tool({
      description:
        "Get available appointment slots for the customer. Call this when the customer expresses interest in visiting the dealership or scheduling a test drive.",
      inputSchema: z.object({
        preferred_date: z.string().optional().describe("Customer's preferred date (YYYY-MM-DD)"),
        appointment_type: z
          .enum(["test_drive", "consultation", "trade_in_appraisal", "general_visit"])
          .describe("Type of appointment"),
      }),
      execute: async (params) => {
        const slots = generateTimeSlots(params.preferred_date);

        return {
          success: true,
          appointment_type: params.appointment_type,
          available_slots: slots,
          dealership_address: "1200 Prestige Boulevard, Beverly Hills, CA 90210",
          dealership_phone: "(310) 555-AUTO",
        };
      },
    }),
  };
}

function generateTimeSlots(preferredDate?: string): Array<{ date: string; times: string[] }> {
  const slots: Array<{ date: string; times: string[] }> = [];
  const start = preferredDate ? new Date(preferredDate) : new Date();
  if (start < new Date()) start.setTime(Date.now());

  let count = 0;
  const d = new Date(start);
  while (count < 5) {
    d.setDate(d.getDate() + (count === 0 ? 0 : 1));
    const day = d.getDay();
    if (day === 0) continue;
    const dateStr = d.toISOString().split("T")[0];
    const times =
      day === 6
        ? ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"]
        : ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    slots.push({ date: dateStr, times });
    count++;
  }

  return slots;
}
