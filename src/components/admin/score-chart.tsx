"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import type { Lead } from "@/lib/supabase/types";

interface ScoreChartProps {
  leads: Lead[];
}

export function ScoreDistributionChart({ leads }: ScoreChartProps) {
  const tierData = [
    { name: "Hot (70-100)", value: leads.filter((l) => l.score_tier === "hot").length, color: "#ef4444" },
    { name: "Warm (40-69)", value: leads.filter((l) => l.score_tier === "warm").length, color: "#f97316" },
    { name: "Cold (0-39)", value: leads.filter((l) => l.score_tier === "cold").length, color: "#3b82f6" },
  ].filter((d) => d.value > 0);

  const buckets = [
    { range: "0-10", min: 0, max: 10 },
    { range: "11-20", min: 11, max: 20 },
    { range: "21-30", min: 21, max: 30 },
    { range: "31-40", min: 31, max: 40 },
    { range: "41-50", min: 41, max: 50 },
    { range: "51-60", min: 51, max: 60 },
    { range: "61-70", min: 61, max: 70 },
    { range: "71-80", min: 71, max: 80 },
    { range: "81-90", min: 81, max: 90 },
    { range: "91-100", min: 91, max: 100 },
  ];

  const histogramData = buckets.map((b) => ({
    range: b.range,
    count: leads.filter((l) => l.score >= b.min && l.score <= b.max).length,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="glass-card p-4">
        <h3 className="mb-4 text-sm font-semibold">Score Distribution by Tier</h3>
        {tierData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {tierData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="glass-card p-4">
        <h3 className="mb-4 text-sm font-semibold">Score Histogram</h3>
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={histogramData}>
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
