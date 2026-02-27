"use client";

import { motion } from "framer-motion";
import { Car, Fuel, Gauge, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  condition: string;
  price: number;
  color?: string;
  mileage?: number;
  features?: string[];
}

interface VehicleCardProps {
  vehicle: VehicleInfo;
  index?: number;
}

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const conditionColors: Record<string, string> = {
    new: "bg-green-500/10 text-green-500 border-green-500/20",
    "certified-pre-owned": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    used: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="glass-card overflow-hidden p-4 hover:border-primary/20 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-sm">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={conditionColors[vehicle.condition] || ""}
              >
                {vehicle.condition.replace("-", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground capitalize">
                {vehicle.category}
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Car className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />$
            {vehicle.price.toLocaleString()}
          </span>
          {vehicle.color && (
            <span className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              {vehicle.color}
            </span>
          )}
          {vehicle.mileage !== undefined && vehicle.mileage !== null && (
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              {vehicle.mileage.toLocaleString()} mi
            </span>
          )}
        </div>

        {vehicle.features && vehicle.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {vehicle.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="secondary" className="text-[10px] px-2 py-0">
                {feature}
              </Badge>
            ))}
            {vehicle.features.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0">
                +{vehicle.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
