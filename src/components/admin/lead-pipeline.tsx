"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Lead } from "@/lib/supabase/types";
import { getTierBgColor } from "@/lib/scoring/engine";
import type { ScoreTier } from "@/lib/supabase/types";

interface LeadPipelineProps {
  leads: Lead[];
}

const stages = [
  { key: "new", label: "New", color: "bg-blue-500" },
  { key: "contacted", label: "Contacted", color: "bg-indigo-500" },
  { key: "qualified", label: "Qualified", color: "bg-purple-500" },
  { key: "appointment_set", label: "Appointment", color: "bg-orange-500" },
  { key: "closed_won", label: "Won", color: "bg-green-500" },
  { key: "closed_lost", label: "Lost", color: "bg-red-500" },
];

export function LeadPipeline({ leads }: LeadPipelineProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stages.map((stage, i) => {
        const stageLeads = leads.filter((l) => l.status === stage.key);
        return (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass-card p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <span className="text-xs font-medium">{stage.label}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  {stageLeads.length}
                </Badge>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {stageLeads.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 text-center">Empty</p>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="rounded-md bg-muted/50 p-2 text-xs"
                    >
                      <p className="font-medium truncate">
                        {lead.name || "Anonymous"}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${getTierBgColor(lead.score_tier as ScoreTier)}`}
                        >
                          {lead.score}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
