"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useReminderStore } from "../hooks/useReminderStore";

export function ReminderDialog() {
  const { selectedMedicine, closeReminder, addReminder } = useReminderStore();
  const [time, setTime] = useState("08:00");

  if (!selectedMedicine) return null;

  return (
    <Modal
      title="Set medicine reminder"
      description={selectedMedicine.name}
      onClose={closeReminder}
    >
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
        <strong>{selectedMedicine.frequency}</strong>
        <div className="mt-1 text-slate-500">{selectedMedicine.timing}</div>
      </div>

      <label className="mt-5 block text-sm font-semibold">
        Reminder time
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3"
        />
      </label>

      <Button
        className="mt-5 w-full"
        onClick={() => addReminder(selectedMedicine, time)}
      >
        <Bell size={17} /> Save reminder
      </Button>
    </Modal>
  );
}
