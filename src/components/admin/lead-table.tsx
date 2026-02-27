"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, ScoreTier } from "@/lib/supabase/types";
import { getTierBgColor } from "@/lib/scoring/engine";

interface LeadTableProps {
  leads: Lead[];
}

type SortField = "score" | "created_at" | "name";
type SortDirection = "asc" | "desc";

export function LeadTable({ leads }: LeadTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = leads.filter((lead) => {
    if (tierFilter !== "all" && lead.score_tier !== tierFilter) return false;
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "score") return (a.score - b.score) * mul;
    if (sortField === "name") return ((a.name || "").localeCompare(b.name || "")) * mul;
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mul;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex gap-3">
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="cold">Cold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="appointment_set">Appointment Set</SelectItem>
            <SelectItem value="closed_won">Closed Won</SelectItem>
            <SelectItem value="closed_lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("name")} className="gap-1 text-xs">
                  Name <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("score")} className="gap-1 text-xs">
                  Score <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("created_at")} className="gap-1 text-xs">
                  Created <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name || "Anonymous"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {lead.email || lead.phone || "—"}
                  </TableCell>
                  <TableCell className="font-mono font-bold">{lead.score}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTierBgColor(lead.score_tier as ScoreTier)}>
                      {lead.score_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {lead.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs capitalize">
                    {lead.timeline?.replace(/_/g, " ") || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/leads/${lead.id}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
