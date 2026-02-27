"use client";

import { useEffect, useState } from "react";
import { LeadTable } from "@/components/admin/lead-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead } from "@/lib/supabase/types";

export default function LeadsPage() {
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
        <h1 className="text-2xl font-bold tracking-tight">All Leads</h1>
        <p className="text-sm text-muted-foreground">
          View, filter, and manage all leads from chat interactions
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-lg" />
      ) : (
        <LeadTable leads={leads} />
      )}
    </div>
  );
}
