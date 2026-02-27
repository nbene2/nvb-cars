"use client";

import { Card } from "@/components/ui/card";
import type { Lead } from "@/lib/supabase/types";

interface ConversionFunnelProps {
  leads: Lead[];
}

export function ConversionFunnel({ leads }: ConversionFunnelProps) {
  const total = leads.length;
  const stages = [
    { key: "all", label: "All Leads", count: total },
    {
      key: "qualified",
      label: "Qualified (Score 40+)",
      count: leads.filter((l) => l.score >= 40).length,
    },
    {
      key: "hot",
      label: "Hot Leads (Score 70+)",
      count: leads.filter((l) => l.score >= 70).length,
    },
    {
      key: "appointment",
      label: "Appointments Set",
      count: leads.filter((l) => l.status === "appointment_set" || l.status === "closed_won").length,
    },
    {
      key: "won",
      label: "Closed Won",
      count: leads.filter((l) => l.status === "closed_won").length,
    },
  ];

  return (
    <Card className="glass-card p-4">
      <h3 className="mb-4 text-sm font-semibold">Conversion Funnel</h3>
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
          const width = total > 0 ? Math.max((stage.count / total) * 100, 8) : 8;
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{stage.label}</span>
                <span className="font-medium">
                  {stage.count} ({pct}%)
                </span>
              </div>
              <div className="h-6 w-full rounded-md bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-md bg-primary/80 transition-all duration-700"
                  style={{
                    width: `${width}%`,
                    opacity: 1 - i * 0.15,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
