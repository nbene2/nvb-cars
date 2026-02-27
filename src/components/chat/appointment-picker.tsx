"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { useState } from "react";

interface AppointmentSlot {
  date: string;
  times: string[];
}

interface AppointmentPickerProps {
  slots: AppointmentSlot[];
  appointmentType: string;
  address: string;
  phone: string;
  onSelect?: (date: string, time: string) => void;
}

export function AppointmentPicker({
  slots,
  appointmentType,
  address,
  phone,
  onSelect,
}: AppointmentPickerProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const typeLabels: Record<string, string> = {
    test_drive: "Test Drive",
    consultation: "Consultation",
    trade_in_appraisal: "Trade-In Appraisal",
    general_visit: "Showroom Visit",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4"
    >
      <Card className="glass-card overflow-hidden p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm">
            Schedule {typeLabels[appointmentType] || "Appointment"}
          </h4>
        </div>

        {/* Date selection */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {slots.map((slot) => {
            const date = parseISO(slot.date);
            const isSelected = selectedDate === slot.date;
            return (
              <Button
                key={slot.date}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="flex-col h-auto py-2 px-3 min-w-[70px]"
                onClick={() => {
                  setSelectedDate(slot.date);
                  setSelectedTime(null);
                }}
              >
                <span className="text-[10px] uppercase">
                  {format(date, "EEE")}
                </span>
                <span className="text-sm font-bold">{format(date, "d")}</span>
                <span className="text-[10px]">{format(date, "MMM")}</span>
              </Button>
            );
          })}
        </div>

        {/* Time slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-3"
          >
            <div className="flex items-center gap-1 mb-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Available times</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {slots
                .find((s) => s.date === selectedDate)
                ?.times.map((time) => (
                  <Badge
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      setSelectedTime(time);
                      onSelect?.(selectedDate, time);
                    }}
                  >
                    {time}
                  </Badge>
                ))}
            </div>
          </motion.div>
        )}

        {selectedTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-primary/5 p-3 text-xs"
          >
            <p className="font-medium text-primary mb-2">
              {typeLabels[appointmentType]} confirmed for{" "}
              {format(parseISO(selectedDate!), "EEEE, MMMM d")} at {selectedTime}
            </p>
            <div className="flex flex-col gap-1 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {address}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {phone}
              </span>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
