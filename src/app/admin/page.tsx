"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/admin/stats-cards";
import { LeadPipeline } from "@/components/admin/lead-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead } from "@/lib/supabase/types";

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    const res = await fetch("/api/data?table=leads");
    const { data } = await res.json();
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 3000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline Overview</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your lead pipeline and scoring metrics in real-time
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <StatsCards leads={leads} />
          <div>
            <h2 className="mb-4 text-lg font-semibold">Lead Pipeline</h2>
            <LeadPipeline leads={leads} />
          </div>
        </>
      )}
    </div>
  );
}
