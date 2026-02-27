"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Car, DollarSign, Clock, ArrowLeftRight, CreditCard } from "lucide-react";
import type { Lead } from "@/lib/supabase/types";

interface LeadDataPanelProps {
  lead: Lead | null;
}

interface DataField {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null | undefined;
}

export function LeadDataPanel({ lead }: LeadDataPanelProps) {
  const vehicleInterest = lead?.vehicle_interest as Record<string, string> | null;
  const tradeIn = lead?.trade_in as Record<string, string | number | boolean> | null;

  const fields: DataField[] = [
    { icon: User, label: "Name", value: lead?.name },
    { icon: Mail, label: "Email", value: lead?.email },
    { icon: Phone, label: "Phone", value: lead?.phone },
    {
      icon: Car,
      label: "Vehicle Interest",
      value: vehicleInterest
        ? [vehicleInterest.make, vehicleInterest.model, vehicleInterest.category]
            .filter(Boolean)
            .join(" ") || null
        : null,
    },
    {
      icon: DollarSign,
      label: "Budget",
      value:
        lead?.budget_min || lead?.budget_max
          ? `$${(lead.budget_min || 0).toLocaleString()} - $${(lead.budget_max || 0).toLocaleString()}`
          : null,
    },
    {
      icon: Clock,
      label: "Timeline",
      value: lead?.timeline?.replace(/_/g, " "),
    },
    {
      icon: ArrowLeftRight,
      label: "Trade-In",
      value: tradeIn?.has_trade_in
        ? [tradeIn.year, tradeIn.make, tradeIn.model].filter(Boolean).join(" ") || "Yes"
        : null,
    },
    {
      icon: CreditCard,
      label: "Financing",
      value: lead?.financing_needed === true ? "Interested" : lead?.financing_needed === false ? "Not needed" : null,
    },
  ];

  return (
    <div className="space-y-2">
      <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Lead Information
      </h4>
      {fields.map((field) => (
        <div key={field.label} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <field.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-muted-foreground">{field.label}</span>
            <AnimatePresence mode="wait">
              {field.value ? (
                <motion.p
                  key={field.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium truncate capitalize"
                >
                  {field.value}
                </motion.p>
              ) : (
                <p className="text-sm text-muted-foreground/40">—</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
