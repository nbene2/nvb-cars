"use client";

import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ChatHeader() {
  return (
    <header className="glass-card flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Car className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">AutoElite Motors</h1>
          <p className="text-xs text-muted-foreground">Sales Chat</p>
        </div>
      </div>
      <Badge variant="outline" className="gap-1 text-xs border-green-500/30 text-green-500">
        Online
      </Badge>
    </header>
  );
}
