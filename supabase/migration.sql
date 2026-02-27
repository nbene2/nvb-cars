-- AutoElite Motors — Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- VEHICLES TABLE
-- ============================================
create table if not exists vehicles (
  id uuid primary key default uuid_generate_v4(),
  make text not null,
  model text not null,
  year integer not null,
  category text not null, -- sedan, suv, truck, coupe, convertible, electric
  condition text not null check (condition in ('new', 'certified-pre-owned', 'used')),
  base_price numeric not null,
  image_url text,
  features jsonb default '[]'::jsonb,
  color text,
  mileage integer,
  vin text unique,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- LEADS TABLE
-- ============================================
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  phone text,
  vehicle_interest jsonb default '{}'::jsonb,
  budget_min numeric,
  budget_max numeric,
  timeline text,
  trade_in jsonb default '{}'::jsonb,
  financing_needed boolean,
  score integer not null default 0,
  score_tier text not null default 'cold' check (score_tier in ('hot', 'warm', 'cold')),
  score_signals jsonb default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'appointment_set', 'closed_won', 'closed_lost')),
  outcome text,
  source text default 'chat',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PROMPT VERSIONS TABLE
-- ============================================
create table if not exists prompt_versions (
  id uuid primary key default uuid_generate_v4(),
  version_number integer not null unique,
  system_prompt text not null,
  scoring_instructions text not null,
  is_active boolean not null default false,
  performance_metrics jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  started_at timestamptz default now(),
  ended_at timestamptz,
  message_count integer not null default 0,
  summary text,
  prompt_version_id uuid references prompt_versions(id),
  created_at timestamptz default now()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null default '',
  rich_content jsonb default '{}'::jsonb,
  tool_calls jsonb default '[]'::jsonb,
  extracted_signals jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- LEAD SCORE HISTORY TABLE
-- ============================================
create table if not exists lead_score_history (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  score integer not null,
  tier text not null check (tier in ('hot', 'warm', 'cold')),
  signals jsonb default '{}'::jsonb,
  trigger_message_id uuid references messages(id),
  created_at timestamptz default now()
);

-- ============================================
-- SCORING WEIGHTS TABLE
-- ============================================
create table if not exists scoring_weights (
  id uuid primary key default uuid_generate_v4(),
  signal_name text not null unique,
  category text not null,
  base_weight numeric not null,
  learned_weight numeric not null default 1.0,
  effective_weight numeric generated always as (base_weight * learned_weight) stored,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- FEEDBACK TABLE
-- ============================================
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  outcome text not null check (outcome in ('purchased', 'no_show', 'lost', 'not_ready', 'unresponsive')),
  final_score integer not null,
  score_signals_snapshot jsonb default '{}'::jsonb,
  was_score_accurate boolean,
  notes text,
  created_by text,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_leads_score on leads(score desc);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created on leads(created_at desc);
create index if not exists idx_conversations_lead on conversations(lead_id);
create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_score_history_lead on lead_score_history(lead_id);
create index if not exists idx_feedback_lead on feedback(lead_id);

-- ============================================
-- ENABLE REALTIME
-- ============================================
alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table lead_score_history;

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger vehicles_updated_at before update on vehicles
  for each row execute function update_updated_at();

create trigger leads_updated_at before update on leads
  for each row execute function update_updated_at();

create trigger scoring_weights_updated_at before update on scoring_weights
  for each row execute function update_updated_at();

create trigger prompt_versions_updated_at before update on prompt_versions
  for each row execute function update_updated_at();

-- ============================================
-- SEED: DEFAULT SCORING WEIGHTS
-- ============================================
insert into scoring_weights (signal_name, category, base_weight, description) values
  ('has_vehicle_preference', 'intent', 8, 'Customer expressed interest in a specific vehicle type'),
  ('specified_condition', 'intent', 5, 'Customer specified new, used, or CPO preference'),
  ('has_budget', 'intent', 10, 'Customer shared their budget range'),
  ('timeline_immediate', 'timeline', 15, 'Customer wants to buy immediately or this week'),
  ('timeline_this_month', 'timeline', 10, 'Customer plans to buy this month'),
  ('timeline_this_quarter', 'timeline', 5, 'Customer plans to buy within 3 months'),
  ('provided_name', 'contact', 6, 'Customer provided their name'),
  ('provided_email', 'contact', 8, 'Customer provided their email'),
  ('provided_phone', 'contact', 10, 'Customer provided their phone number'),
  ('has_trade_in', 'financial', 7, 'Customer has a vehicle to trade in'),
  ('discussed_financing', 'financial', 6, 'Customer discussed financing options'),
  ('multi_turn_conversation', 'engagement', 4, 'Conversation went beyond 3 exchanges'),
  ('asked_specific_questions', 'engagement', 5, 'Customer asked detailed questions about vehicles'),
  ('requested_appointment', 'engagement', 12, 'Customer requested a test drive or appointment')
on conflict (signal_name) do nothing;

-- ============================================
-- SEED: DEFAULT PROMPT VERSION
-- ============================================
insert into prompt_versions (version_number, system_prompt, scoring_instructions, is_active) values
(1,
'You are Alex, a friendly and knowledgeable sales consultant at AutoElite Motors, a premium car dealership. Your goal is to help customers find their perfect vehicle while naturally qualifying them as leads.

Guidelines:
- Be warm, professional, and genuinely helpful
- Ask open-ended questions to understand needs
- Naturally gather qualifying information without being pushy
- Share enthusiasm about vehicles while being honest
- If a customer seems ready, suggest scheduling a test drive
- Never pressure customers; let the conversation flow naturally

Vehicle Categories Available: Sedans, SUVs, Trucks, Coupes, Convertibles, Electric Vehicles
Conditions: New, Certified Pre-Owned, Used

Remember: Every interaction is an opportunity to build trust. Focus on the customer''s needs first.',

'Use tools to extract and record lead information as the conversation progresses:
- Call updateLeadInfo whenever the customer reveals: name, email, phone, vehicle preferences, budget, timeline, trade-in details, or financing interest
- Call recommendVehicle when you have enough information about their preferences
- Call scheduleAppointment when the customer shows interest in visiting or test driving

Scoring signals to naturally extract:
- Vehicle preference (type, make, model)
- Condition preference (new/used/CPO)
- Budget range
- Purchase timeline
- Contact information
- Trade-in vehicle
- Financing needs
- Level of engagement and specific questions',
true)
on conflict (version_number) do nothing;

-- ============================================
-- SEED: SAMPLE VEHICLES
-- ============================================
insert into vehicles (make, model, year, category, condition, base_price, color, mileage, features, image_url) values
  ('BMW', '5 Series', 2025, 'sedan', 'new', 62000, 'Alpine White', 0, '["Leather Interior", "Panoramic Sunroof", "Adaptive Cruise Control", "Head-Up Display", "Harman Kardon Sound"]'::jsonb, '/vehicles/bmw-5.jpg'),
  ('Mercedes-Benz', 'GLE 450', 2025, 'suv', 'new', 72000, 'Obsidian Black', 0, '["AMG Line", "MBUX Infotainment", "Air Suspension", "360 Camera", "Burmester Sound System"]'::jsonb, '/vehicles/mb-gle.jpg'),
  ('Porsche', 'Cayenne', 2024, 'suv', 'certified-pre-owned', 68500, 'Carrara White', 12000, '["Sport Chrono Package", "BOSE Sound", "Panoramic Roof", "21-inch Wheels", "Adaptive Air Suspension"]'::jsonb, '/vehicles/porsche-cayenne.jpg'),
  ('Tesla', 'Model S', 2025, 'electric', 'new', 79990, 'Pearl White', 0, '["Full Self-Driving", "Plaid Powertrain", "Glass Roof", "Premium Interior", "HEPA Filtration"]'::jsonb, '/vehicles/tesla-ms.jpg'),
  ('Audi', 'e-tron GT', 2025, 'electric', 'new', 106000, 'Daytona Gray', 0, '["quattro AWD", "Matrix LED", "Bang & Olufsen 3D Sound", "Air Suspension", "RS Sport Seats"]'::jsonb, '/vehicles/audi-etron.jpg'),
  ('Land Rover', 'Range Rover Sport', 2024, 'suv', 'certified-pre-owned', 82000, 'Santorini Black', 8500, '["Meridian Sound", "Terrain Response 2", "Pixel LED", "Pivi Pro", "Configurable Dynamics"]'::jsonb, '/vehicles/rr-sport.jpg'),
  ('BMW', 'M4 Competition', 2025, 'coupe', 'new', 84000, 'Isle of Man Green', 0, '["M Carbon Bucket Seats", "M Carbon Roof", "M Adaptive Suspension", "M Drive Professional", "Laserlight"]'::jsonb, '/vehicles/bmw-m4.jpg'),
  ('Mercedes-Benz', 'C 300', 2024, 'sedan', 'certified-pre-owned', 38500, 'Selenite Grey', 15000, '["AMG Line", "Digital Light", "MBUX", "Burmester", "Panoramic Sunroof"]'::jsonb, '/vehicles/mb-c300.jpg'),
  ('Ford', 'F-150 Lightning', 2025, 'truck', 'new', 55000, 'Iconic Silver', 0, '["Extended Range Battery", "BlueCruise", "Pro Power Onboard", "Max Recline Seats", "360 Camera"]'::jsonb, '/vehicles/f150-lightning.jpg'),
  ('Porsche', '911 Carrera', 2025, 'coupe', 'new', 120000, 'GT Silver', 0, '["Sport Exhaust", "PASM", "Sport Chrono", "Carbon Interior", "Bose Surround Sound"]'::jsonb, '/vehicles/porsche-911.jpg'),
  ('Lexus', 'RX 500h', 2025, 'suv', 'new', 62500, 'Caviar Black', 0, '["F SPORT Performance", "Mark Levinson Audio", "Panoramic Roof", "Advanced Safety+", "Head-Up Display"]'::jsonb, '/vehicles/lexus-rx.jpg'),
  ('Toyota', 'Camry', 2025, 'sedan', 'new', 32000, 'Wind Chill Pearl', 0, '["JBL Audio", "Dynamic Force Engine", "Safety Sense 3.0", "Wireless Charging", "12.3-inch Display"]'::jsonb, '/vehicles/toyota-camry.jpg')
on conflict do nothing;
