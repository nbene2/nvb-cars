import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { computeScore } from "@/lib/scoring/engine";

export const maxDuration = 30;

const scoringSchema = z.object({
  signals: z.object({
    has_vehicle_preference: z.boolean().describe("Customer mentioned a vehicle type, make, model, or category"),
    specified_condition: z.boolean().describe("Customer specified new, used, or certified pre-owned"),
    has_budget: z.boolean().describe("Customer shared any budget or price range"),
    timeline_immediate: z.boolean().describe("Customer wants to buy right away or this week"),
    timeline_this_month: z.boolean().describe("Customer plans to buy within a month"),
    timeline_this_quarter: z.boolean().describe("Customer plans to buy within 3 months"),
    provided_name: z.boolean().describe("Customer shared their name"),
    provided_email: z.boolean().describe("Customer shared an email address"),
    provided_phone: z.boolean().describe("Customer shared a phone number"),
    has_trade_in: z.boolean().describe("Customer mentioned having a vehicle to trade in"),
    discussed_financing: z.boolean().describe("Customer discussed financing, monthly payments, or loans"),
    multi_turn_conversation: z.boolean().describe("Conversation has 3 or more customer messages"),
    asked_specific_questions: z.boolean().describe("Customer asked detailed questions about specific vehicles or features"),
    requested_appointment: z.boolean().describe("Customer asked about visiting, test drives, or scheduling"),
  }),
  lead_info: z.object({
    name: z.string().nullable().describe("Customer's name if mentioned"),
    email: z.string().nullable().describe("Customer's email if mentioned"),
    phone: z.string().nullable().describe("Customer's phone if mentioned"),
    vehicle_interest: z.object({
      category: z.string().nullable().describe("sedan, suv, truck, coupe, electric, etc."),
      make: z.string().nullable().describe("Brand preference"),
      model: z.string().nullable().describe("Specific model"),
      condition: z.string().nullable().describe("new, used, or certified-pre-owned"),
    }).describe("What the customer is looking for"),
    budget_min: z.number().nullable().describe("Low end of budget if mentioned"),
    budget_max: z.number().nullable().describe("High end of budget if mentioned"),
    timeline: z.string().nullable().describe("immediate, this_week, this_month, this_quarter, or just_browsing"),
    has_trade_in: z.boolean().nullable().describe("Whether customer has a trade-in"),
    financing_needed: z.boolean().nullable().describe("Whether customer needs financing"),
  }),
});

const SCORER_PROMPT = `You are a lead scoring analyst for a car dealership. Analyze this conversation between a customer and a sales consultant. Extract all qualifying signals and customer information.

Be accurate — only mark signals as true if clearly supported by the conversation. Do not infer or guess. If the customer hasn't mentioned something, mark it as false or null.

For timeline signals, only one should be true (the most specific one mentioned).`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    // Build a plain text transcript for the scorer
    const transcript = messages
      .map((m: { role: string; content?: string; parts?: Array<{ type: string; text?: string }> }) => {
        let text = m.content || "";
        if (!text && m.parts) {
          text = m.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text || "")
            .join("");
        }
        return `${m.role === "user" ? "Customer" : "Sales Consultant"}: ${text}`;
      })
      .filter((line: string) => line.trim().length > 10)
      .join("\n\n");

    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-5"),
      schema: scoringSchema,
      system: SCORER_PROMPT,
      prompt: transcript,
    });

    // Compute score from signals
    const { score, tier } = computeScore(object.signals);

    return NextResponse.json({
      score,
      tier,
      signals: object.signals,
      lead: object.lead_info,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scoring failed";
    console.error("[scorer error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
