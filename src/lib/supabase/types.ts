export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          make: string;
          model: string;
          year: number;
          category: string;
          condition: "new" | "certified-pre-owned" | "used";
          base_price: number;
          image_url: string | null;
          features: Json;
          color: string | null;
          mileage: number | null;
          vin: string | null;
          status: "available" | "reserved" | "sold";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          make: string;
          model: string;
          year: number;
          category: string;
          condition: "new" | "certified-pre-owned" | "used";
          base_price: number;
          image_url?: string | null;
          features?: Json;
          color?: string | null;
          mileage?: number | null;
          vin?: string | null;
          status?: "available" | "reserved" | "sold";
        };
        Update: {
          make?: string;
          model?: string;
          year?: number;
          category?: string;
          condition?: "new" | "certified-pre-owned" | "used";
          base_price?: number;
          image_url?: string | null;
          features?: Json;
          color?: string | null;
          mileage?: number | null;
          vin?: string | null;
          status?: "available" | "reserved" | "sold";
        };
      };
      leads: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          vehicle_interest: Json;
          budget_min: number | null;
          budget_max: number | null;
          timeline: string | null;
          trade_in: Json;
          financing_needed: boolean | null;
          score: number;
          score_tier: "hot" | "warm" | "cold";
          score_signals: Json;
          status: "new" | "contacted" | "qualified" | "appointment_set" | "closed_won" | "closed_lost";
          outcome: string | null;
          source: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          vehicle_interest?: Json;
          budget_min?: number | null;
          budget_max?: number | null;
          timeline?: string | null;
          trade_in?: Json;
          financing_needed?: boolean | null;
          score?: number;
          score_tier?: "hot" | "warm" | "cold";
          score_signals?: Json;
          status?: "new" | "contacted" | "qualified" | "appointment_set" | "closed_won" | "closed_lost";
          outcome?: string | null;
          source?: string | null;
          notes?: string | null;
        };
        Update: {
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          vehicle_interest?: Json;
          budget_min?: number | null;
          budget_max?: number | null;
          timeline?: string | null;
          trade_in?: Json;
          financing_needed?: boolean | null;
          score?: number;
          score_tier?: "hot" | "warm" | "cold";
          score_signals?: Json;
          status?: "new" | "contacted" | "qualified" | "appointment_set" | "closed_won" | "closed_lost";
          outcome?: string | null;
          source?: string | null;
          notes?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          lead_id: string;
          started_at: string;
          ended_at: string | null;
          message_count: number;
          summary: string | null;
          prompt_version_id: string | null;
          created_at: string;
        };
        Insert: {
          lead_id: string;
          started_at?: string;
          ended_at?: string | null;
          message_count?: number;
          summary?: string | null;
          prompt_version_id?: string | null;
        };
        Update: {
          lead_id?: string;
          started_at?: string;
          ended_at?: string | null;
          message_count?: number;
          summary?: string | null;
          prompt_version_id?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant" | "system" | "tool";
          content: string;
          rich_content: Json;
          tool_calls: Json;
          extracted_signals: Json;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          role: "user" | "assistant" | "system" | "tool";
          content?: string;
          rich_content?: Json;
          tool_calls?: Json;
          extracted_signals?: Json;
        };
        Update: {
          conversation_id?: string;
          role?: "user" | "assistant" | "system" | "tool";
          content?: string;
          rich_content?: Json;
          tool_calls?: Json;
          extracted_signals?: Json;
        };
      };
      lead_score_history: {
        Row: {
          id: string;
          lead_id: string;
          score: number;
          tier: "hot" | "warm" | "cold";
          signals: Json;
          trigger_message_id: string | null;
          created_at: string;
        };
        Insert: {
          lead_id: string;
          score: number;
          tier: "hot" | "warm" | "cold";
          signals?: Json;
          trigger_message_id?: string | null;
        };
        Update: {
          lead_id?: string;
          score?: number;
          tier?: "hot" | "warm" | "cold";
          signals?: Json;
          trigger_message_id?: string | null;
        };
      };
      scoring_weights: {
        Row: {
          id: string;
          signal_name: string;
          category: string;
          base_weight: number;
          learned_weight: number;
          effective_weight: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          signal_name: string;
          category: string;
          base_weight: number;
          learned_weight?: number;
          description?: string | null;
        };
        Update: {
          signal_name?: string;
          category?: string;
          base_weight?: number;
          learned_weight?: number;
          description?: string | null;
        };
      };
      feedback: {
        Row: {
          id: string;
          lead_id: string;
          outcome: "purchased" | "no_show" | "lost" | "not_ready" | "unresponsive";
          final_score: number;
          score_signals_snapshot: Json;
          was_score_accurate: boolean | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          lead_id: string;
          outcome: "purchased" | "no_show" | "lost" | "not_ready" | "unresponsive";
          final_score: number;
          score_signals_snapshot?: Json;
          was_score_accurate?: boolean | null;
          notes?: string | null;
          created_by?: string | null;
        };
        Update: {
          lead_id?: string;
          outcome?: "purchased" | "no_show" | "lost" | "not_ready" | "unresponsive";
          final_score?: number;
          score_signals_snapshot?: Json;
          was_score_accurate?: boolean | null;
          notes?: string | null;
          created_by?: string | null;
        };
      };
      prompt_versions: {
        Row: {
          id: string;
          version_number: number;
          system_prompt: string;
          scoring_instructions: string;
          is_active: boolean;
          performance_metrics: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          version_number: number;
          system_prompt: string;
          scoring_instructions: string;
          is_active?: boolean;
          performance_metrics?: Json;
        };
        Update: {
          version_number?: number;
          system_prompt?: string;
          scoring_instructions?: string;
          is_active?: boolean;
          performance_metrics?: Json;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type LeadScoreHistory = Database["public"]["Tables"]["lead_score_history"]["Row"];
export type ScoringWeight = Database["public"]["Tables"]["scoring_weights"]["Row"];
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];
export type PromptVersion = Database["public"]["Tables"]["prompt_versions"]["Row"];

export type ScoreTier = "hot" | "warm" | "cold";
export type LeadOutcome = "purchased" | "no_show" | "lost" | "not_ready" | "unresponsive";
export type LeadStatus = Lead["status"];
export type VehicleCondition = Vehicle["condition"];

export interface ScoreSignals {
  has_vehicle_preference: boolean;
  specified_condition: boolean;
  has_budget: boolean;
  timeline_immediate: boolean;
  timeline_this_month: boolean;
  timeline_this_quarter: boolean;
  provided_name: boolean;
  provided_email: boolean;
  provided_phone: boolean;
  has_trade_in: boolean;
  discussed_financing: boolean;
  multi_turn_conversation: boolean;
  asked_specific_questions: boolean;
  requested_appointment: boolean;
}
