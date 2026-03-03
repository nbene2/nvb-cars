// In-memory store that replaces Supabase for demo purposes.
// Data persists within a single server process — restarting the dev server resets it.

import { EMPTY_SIGNALS, computeScore } from "@/lib/scoring/engine";
import type { ScoreSignals } from "@/lib/supabase/types";

function uuid() {
  return crypto.randomUUID();
}

// ---- VEHICLES ----
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  condition: "new" | "certified-pre-owned" | "used";
  base_price: number;
  image_url: string | null;
  features: string[];
  color: string | null;
  mileage: number | null;
  vin: string | null;
  status: "available" | "reserved" | "sold";
  created_at: string;
  updated_at: string;
}

const SEED_VEHICLES: Vehicle[] = [
  { id: uuid(), make: "BMW", model: "5 Series", year: 2025, category: "sedan", condition: "new", base_price: 62000, color: "Alpine White", mileage: 0, features: ["Leather Interior", "Panoramic Sunroof", "Adaptive Cruise Control", "Head-Up Display", "Harman Kardon Sound"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Mercedes-Benz", model: "GLE 450", year: 2025, category: "suv", condition: "new", base_price: 72000, color: "Obsidian Black", mileage: 0, features: ["AMG Line", "MBUX Infotainment", "Air Suspension", "360 Camera", "Burmester Sound System"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Porsche", model: "Cayenne", year: 2024, category: "suv", condition: "certified-pre-owned", base_price: 68500, color: "Carrara White", mileage: 12000, features: ["Sport Chrono Package", "BOSE Sound", "Panoramic Roof", "21-inch Wheels", "Adaptive Air Suspension"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Tesla", model: "Model S", year: 2025, category: "electric", condition: "new", base_price: 79990, color: "Pearl White", mileage: 0, features: ["Full Self-Driving", "Plaid Powertrain", "Glass Roof", "Premium Interior", "HEPA Filtration"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Audi", model: "e-tron GT", year: 2025, category: "electric", condition: "new", base_price: 106000, color: "Daytona Gray", mileage: 0, features: ["quattro AWD", "Matrix LED", "Bang & Olufsen 3D Sound", "Air Suspension", "RS Sport Seats"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Land Rover", model: "Range Rover Sport", year: 2024, category: "suv", condition: "certified-pre-owned", base_price: 82000, color: "Santorini Black", mileage: 8500, features: ["Meridian Sound", "Terrain Response 2", "Pixel LED", "Pivi Pro", "Configurable Dynamics"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "BMW", model: "M4 Competition", year: 2025, category: "coupe", condition: "new", base_price: 84000, color: "Isle of Man Green", mileage: 0, features: ["M Carbon Bucket Seats", "M Carbon Roof", "M Adaptive Suspension", "M Drive Professional", "Laserlight"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Mercedes-Benz", model: "C 300", year: 2024, category: "sedan", condition: "certified-pre-owned", base_price: 38500, color: "Selenite Grey", mileage: 15000, features: ["AMG Line", "Digital Light", "MBUX", "Burmester", "Panoramic Sunroof"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Ford", model: "F-150 Lightning", year: 2025, category: "truck", condition: "new", base_price: 55000, color: "Iconic Silver", mileage: 0, features: ["Extended Range Battery", "BlueCruise", "Pro Power Onboard", "Max Recline Seats", "360 Camera"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Porsche", model: "911 Carrera", year: 2025, category: "coupe", condition: "new", base_price: 120000, color: "GT Silver", mileage: 0, features: ["Sport Exhaust", "PASM", "Sport Chrono", "Carbon Interior", "Bose Surround Sound"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Lexus", model: "RX 500h", year: 2025, category: "suv", condition: "new", base_price: 62500, color: "Caviar Black", mileage: 0, features: ["F SPORT Performance", "Mark Levinson Audio", "Panoramic Roof", "Advanced Safety+", "Head-Up Display"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuid(), make: "Toyota", model: "Camry", year: 2025, category: "sedan", condition: "new", base_price: 32000, color: "Wind Chill Pearl", mileage: 0, features: ["JBL Audio", "Dynamic Force Engine", "Safety Sense 3.0", "Wireless Charging", "12.3-inch Display"], image_url: null, vin: null, status: "available", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// ---- LEADS ----
export interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  vehicle_interest: Record<string, unknown>;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
  trade_in: Record<string, unknown>;
  financing_needed: boolean | null;
  score: number;
  score_tier: "hot" | "warm" | "cold";
  score_signals: Partial<ScoreSignals>;
  status: string;
  outcome: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  started_at: string;
  ended_at: string | null;
  message_count: number;
  summary: string | null;
  prompt_version_id: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  rich_content: Record<string, unknown>;
  tool_calls: unknown[];
  extracted_signals: Record<string, unknown>;
  created_at: string;
}

export interface LeadScoreHistory {
  id: string;
  lead_id: string;
  score: number;
  tier: "hot" | "warm" | "cold";
  signals: Partial<ScoreSignals>;
  trigger_message_id: string | null;
  created_at: string;
}

export interface ScoringWeight {
  id: string;
  signal_name: string;
  category: string;
  base_weight: number;
  learned_weight: number;
  effective_weight: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  lead_id: string;
  outcome: string;
  final_score: number;
  score_signals_snapshot: Partial<ScoreSignals>;
  was_score_accurate: boolean | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface PromptVersion {
  id: string;
  version_number: number;
  system_prompt: string;
  scoring_instructions: string;
  is_active: boolean;
  performance_metrics: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ---- THE STORE ----
class InMemoryStore {
  vehicles: Vehicle[] = [...SEED_VEHICLES];
  leads: Lead[] = [];
  conversations: Conversation[] = [];
  messages: Message[] = [];
  scoreHistory: LeadScoreHistory[] = [];
  feedback: Feedback[] = [];

  scoringWeights: ScoringWeight[] = [
    { id: uuid(), signal_name: "has_vehicle_preference", category: "intent", base_weight: 8, learned_weight: 1, effective_weight: 8, description: "Customer expressed interest in a specific vehicle type", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "specified_condition", category: "intent", base_weight: 5, learned_weight: 1, effective_weight: 5, description: "Customer specified new, used, or CPO preference", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "has_budget", category: "intent", base_weight: 10, learned_weight: 1, effective_weight: 10, description: "Customer shared their budget range", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "timeline_immediate", category: "timeline", base_weight: 15, learned_weight: 1, effective_weight: 15, description: "Customer wants to buy immediately", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "timeline_this_month", category: "timeline", base_weight: 10, learned_weight: 1, effective_weight: 10, description: "Customer plans to buy this month", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "timeline_this_quarter", category: "timeline", base_weight: 5, learned_weight: 1, effective_weight: 5, description: "Customer plans to buy within 3 months", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "provided_name", category: "contact", base_weight: 6, learned_weight: 1, effective_weight: 6, description: "Customer provided their name", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "provided_email", category: "contact", base_weight: 8, learned_weight: 1, effective_weight: 8, description: "Customer provided their email", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "provided_phone", category: "contact", base_weight: 10, learned_weight: 1, effective_weight: 10, description: "Customer provided their phone number", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "has_trade_in", category: "financial", base_weight: 7, learned_weight: 1, effective_weight: 7, description: "Customer has a vehicle to trade in", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "discussed_financing", category: "financial", base_weight: 6, learned_weight: 1, effective_weight: 6, description: "Customer discussed financing options", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "multi_turn_conversation", category: "engagement", base_weight: 4, learned_weight: 1, effective_weight: 4, description: "Conversation went beyond 3 exchanges", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "asked_specific_questions", category: "engagement", base_weight: 5, learned_weight: 1, effective_weight: 5, description: "Customer asked detailed questions", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uuid(), signal_name: "requested_appointment", category: "engagement", base_weight: 12, learned_weight: 1, effective_weight: 12, description: "Customer requested a test drive or appointment", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  promptVersions: PromptVersion[] = [
    {
      id: uuid(),
      version_number: 1,
      system_prompt: "You are Alex, a friendly and knowledgeable sales consultant at AutoElite Motors.",
      scoring_instructions: "Use tools to extract and record lead information as the conversation progresses.",
      is_active: true,
      performance_metrics: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // ---- Lead CRUD ----
  createLead(data: Partial<Lead> = {}): Lead {
    const lead: Lead = {
      id: uuid(),
      name: null,
      email: null,
      phone: null,
      vehicle_interest: {},
      budget_min: null,
      budget_max: null,
      timeline: null,
      trade_in: {},
      financing_needed: null,
      score: 0,
      score_tier: "cold",
      score_signals: {},
      status: "new",
      outcome: null,
      source: "chat",
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.leads.push(lead);
    return lead;
  }

  getLead(id: string): Lead | undefined {
    return this.leads.find((l) => l.id === id);
  }

  updateLead(id: string, data: Partial<Lead>): Lead | undefined {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      Object.assign(lead, data, { updated_at: new Date().toISOString() });
    }
    return lead;
  }

  // ---- Conversation CRUD ----
  createConversation(leadId: string): Conversation {
    const conv: Conversation = {
      id: uuid(),
      lead_id: leadId,
      started_at: new Date().toISOString(),
      ended_at: null,
      message_count: 0,
      summary: null,
      prompt_version_id: null,
      created_at: new Date().toISOString(),
    };
    this.conversations.push(conv);
    return conv;
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.find((c) => c.id === id);
  }

  updateConversation(id: string, data: Partial<Conversation>): void {
    const conv = this.conversations.find((c) => c.id === id);
    if (conv) Object.assign(conv, data);
  }

  // ---- Message CRUD ----
  addMessage(data: Omit<Message, "id" | "created_at">): Message {
    const msg: Message = {
      ...data,
      id: uuid(),
      created_at: new Date().toISOString(),
    };
    this.messages.push(msg);
    return msg;
  }

  getMessages(conversationId: string): Message[] {
    return this.messages
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  // ---- Score History ----
  addScoreHistory(data: Omit<LeadScoreHistory, "id" | "created_at">): LeadScoreHistory {
    const entry: LeadScoreHistory = {
      ...data,
      id: uuid(),
      created_at: new Date().toISOString(),
    };
    this.scoreHistory.push(entry);
    return entry;
  }

  getScoreHistory(leadId: string): LeadScoreHistory[] {
    return this.scoreHistory
      .filter((h) => h.lead_id === leadId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  // ---- Vehicles ----
  queryVehicles(filters: {
    category?: string;
    condition?: string;
    min_price?: number;
    max_price?: number;
    make?: string;
  }): Vehicle[] {
    return this.vehicles
      .filter((v) => v.status === "available")
      .filter((v) => !filters.category || v.category === filters.category)
      .filter((v) => !filters.condition || v.condition === filters.condition)
      .filter((v) => !filters.min_price || v.base_price >= filters.min_price)
      .filter((v) => !filters.max_price || v.base_price <= filters.max_price)
      .filter((v) => !filters.make || v.make.toLowerCase().includes(filters.make.toLowerCase()))
      .sort((a, b) => a.base_price - b.base_price)
      .slice(0, 3);
  }

  // ---- Feedback ----
  addFeedback(data: Omit<Feedback, "id" | "created_at">): Feedback {
    const fb: Feedback = {
      ...data,
      id: uuid(),
      created_at: new Date().toISOString(),
    };
    this.feedback.push(fb);
    return fb;
  }

  // ---- Prompt Versions ----
  updatePromptVersion(id: string, data: Partial<PromptVersion>): void {
    const pv = this.promptVersions.find((p) => p.id === id);
    if (pv) {
      Object.assign(pv, data, { updated_at: new Date().toISOString() });
    }
  }

  // ---- Scoring Weights ----
  updateWeight(id: string, data: Partial<ScoringWeight>): void {
    const w = this.scoringWeights.find((sw) => sw.id === id);
    if (w) {
      Object.assign(w, data, { updated_at: new Date().toISOString() });
      w.effective_weight = w.base_weight * w.learned_weight;
    }
  }
}

// Singleton
export const store = new InMemoryStore();
