import { z } from "zod";
import { tool } from "ai";
import { store } from "@/lib/store/in-memory";
import { computeScore, mergeSignals, EMPTY_SIGNALS } from "@/lib/scoring/engine";
import type { ScoreSignals } from "@/lib/supabase/types";

export function createTools(leadId: string, _conversationId: string) {
  return {
    updateLeadInfo: tool({
      description:
        "Update the lead's information and scoring signals whenever the customer reveals qualifying data. Call this immediately each time you learn something new — name, email, phone, vehicle preferences, budget, timeline, trade-in details, or financing interest.",
      inputSchema: z.object({
        name: z.string().optional().describe("Customer's name"),
        email: z.string().email().optional().describe("Customer's email address"),
        phone: z.string().optional().describe("Customer's phone number"),
        vehicle_interest: z
          .object({
            category: z.string().optional().describe("sedan, suv, truck, coupe, convertible, electric"),
            make: z.string().optional(),
            model: z.string().optional(),
            condition: z.enum(["new", "certified-pre-owned", "used"]).optional(),
            features: z.array(z.string()).optional(),
          })
          .optional()
          .describe("Vehicle preferences"),
        budget_min: z.number().optional().describe("Minimum budget in USD"),
        budget_max: z.number().optional().describe("Maximum budget in USD"),
        timeline: z
          .enum(["immediate", "this_week", "this_month", "this_quarter", "just_browsing"])
          .optional()
          .describe("Purchase timeline"),
        trade_in: z
          .object({
            has_trade_in: z.boolean(),
            make: z.string().optional(),
            model: z.string().optional(),
            year: z.number().optional(),
            condition: z.string().optional(),
          })
          .optional()
          .describe("Trade-in vehicle details"),
        financing_needed: z.boolean().optional().describe("Whether the customer needs financing"),
        signals: z
          .object({
            has_vehicle_preference: z.boolean().optional(),
            specified_condition: z.boolean().optional(),
            has_budget: z.boolean().optional(),
            timeline_immediate: z.boolean().optional(),
            timeline_this_month: z.boolean().optional(),
            timeline_this_quarter: z.boolean().optional(),
            provided_name: z.boolean().optional(),
            provided_email: z.boolean().optional(),
            provided_phone: z.boolean().optional(),
            has_trade_in: z.boolean().optional(),
            discussed_financing: z.boolean().optional(),
            multi_turn_conversation: z.boolean().optional(),
            asked_specific_questions: z.boolean().optional(),
            requested_appointment: z.boolean().optional(),
          })
          .optional()
          .describe("Scoring signals detected in this interaction"),
      }),
      execute: async (params) => {
        const currentLead = store.getLead(leadId);
        if (!currentLead) {
          return { success: false, error: "Lead not found" };
        }

        // Merge signals
        const existingSignals = (currentLead.score_signals || EMPTY_SIGNALS) as Partial<ScoreSignals>;
        const newSignals = params.signals || {};
        const mergedSignals = mergeSignals(existingSignals, newSignals);

        // Compute new score
        const { score, tier } = computeScore(mergedSignals);

        // Build update
        const update: Record<string, unknown> = {
          score,
          score_tier: tier,
          score_signals: mergedSignals,
        };

        if (params.name) update.name = params.name;
        if (params.email) update.email = params.email;
        if (params.phone) update.phone = params.phone;
        if (params.budget_min) update.budget_min = params.budget_min;
        if (params.budget_max) update.budget_max = params.budget_max;
        if (params.timeline) update.timeline = params.timeline;
        if (params.financing_needed !== undefined) update.financing_needed = params.financing_needed;

        if (params.vehicle_interest) {
          update.vehicle_interest = { ...currentLead.vehicle_interest, ...params.vehicle_interest };
        }

        if (params.trade_in) {
          update.trade_in = params.trade_in;
        }

        store.updateLead(leadId, update as Parameters<typeof store.updateLead>[1]);

        store.addScoreHistory({
          lead_id: leadId,
          score,
          tier,
          signals: mergedSignals,
          trigger_message_id: null,
        });

        const updatedLead = store.getLead(leadId);

        return {
          success: true,
          score,
          tier,
          signals: mergedSignals,
          signals_detected: Object.entries(mergedSignals)
            .filter(([, v]) => v)
            .map(([k]) => k),
          lead: updatedLead ? {
            name: updatedLead.name,
            email: updatedLead.email,
            phone: updatedLead.phone,
            vehicle_interest: updatedLead.vehicle_interest,
            budget_min: updatedLead.budget_min,
            budget_max: updatedLead.budget_max,
            timeline: updatedLead.timeline,
            trade_in: updatedLead.trade_in,
            financing_needed: updatedLead.financing_needed,
          } : null,
        };
      },
    }),

    recommendVehicle: tool({
      description:
        "Search the vehicle inventory to find matching vehicles based on the customer's preferences. Call this when you have enough context about what they're looking for.",
      inputSchema: z.object({
        category: z.string().optional().describe("Vehicle category: sedan, suv, truck, coupe, convertible, electric"),
        condition: z.enum(["new", "certified-pre-owned", "used"]).optional(),
        min_price: z.number().optional().describe("Minimum price"),
        max_price: z.number().optional().describe("Maximum price"),
        make: z.string().optional().describe("Preferred make/brand"),
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
        let score = 0;
        let tier: "hot" | "warm" | "cold" = "cold";
        let signals: Partial<ScoreSignals> = {};

        const lead = store.getLead(leadId);
        if (lead) {
          signals = mergeSignals(
            (lead.score_signals || EMPTY_SIGNALS) as Partial<ScoreSignals>,
            { requested_appointment: true }
          );
          ({ score, tier } = computeScore(signals));
          store.updateLead(leadId, { status: "appointment_set", score, score_tier: tier, score_signals: signals });
          store.addScoreHistory({ lead_id: leadId, score, tier, signals, trigger_message_id: null });
        }

        const slots = generateTimeSlots(params.preferred_date);

        return {
          success: true,
          score,
          tier,
          signals,
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
