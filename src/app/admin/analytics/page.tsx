"use client";

import { useEffect, useState } from "react";
import { ScoreDistributionChart } from "@/components/admin/score-chart";
import { ConversionFunnel } from "@/components/admin/conversion-funnel";
import { StatsCards } from "@/components/admin/stats-cards";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead } from "@/lib/supabase/types";

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data?table=leads")
      .then((r) => r.json())
      .then(({ data }) => {
        setLeads(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Score distributions, conversion funnels, and qualification insights
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      ) : (
        <>
          <StatsCards leads={leads} />
          <ScoreDistributionChart leads={leads} />
          <ConversionFunnel leads={leads} />
        </>
      )}
    </div>
  );
}
