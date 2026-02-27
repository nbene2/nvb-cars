"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Calendar, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Lead } from "@/lib/supabase/types";

interface StatsCardsProps {
  leads: Lead[];
}

export function StatsCards({ leads }: StatsCardsProps) {
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.score_tier === "hot").length;
  const warmLeads = leads.filter((l) => l.score_tier === "warm").length;
  const appointments = leads.filter((l) => l.status === "appointment_set").length;
  const avgScore = totalLeads > 0
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / totalLeads)
    : 0;

  const stats = [
    {
      icon: Users,
      label: "Total Leads",
      value: totalLeads,
      description: `${hotLeads} hot, ${warmLeads} warm`,
      color: "text-blue-500",
    },
    {
      icon: Target,
      label: "Hot Leads",
      value: hotLeads,
      description: `${totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0}% of total`,
      color: "text-red-500",
    },
    {
      icon: TrendingUp,
      label: "Avg Score",
      value: avgScore,
      description: "Across all leads",
      color: "text-green-500",
    },
    {
      icon: Calendar,
      label: "Appointments",
      value: appointments,
      description: "Scheduled visits",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
