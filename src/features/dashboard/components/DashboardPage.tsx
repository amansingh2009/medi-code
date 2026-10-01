"use client";

import { Bell, FileText, HeartPulse, Pill, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/features/app/hooks/useAppStore";
import { usePrescriptionStore } from "@/features/prescriptions/hooks/usePrescriptionStore";

export function DashboardPage() {
  const { setActiveTab } = useAppStore();
  const { prescription, openUpload } = usePrescriptionStore();

  const medicines = prescription?.medicines.length ?? 0;
  const reminders = 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-teal-700 to-cyan-700 p-6 text-white sm:p-8">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <HeartPulse size={14} /> AI-powered prescription decoder
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Understand your medicine, simply.</h1>
          <p className="mt-3 text-sm leading-6 text-teal-50 sm:text-base">
            Upload a prescription and turn difficult handwriting or medical terms into clear information.
          </p>
          <Button
            className="mt-6 bg-white text-teal-800 hover:bg-teal-50"
            onClick={openUpload}
          >
            <Upload size={18} /> Decode Prescription
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Prescriptions" value={prescription ? 1 : 0} icon={FileText} />
        <Stat label="Active medicines" value={medicines} icon={Pill} />
        <Stat label="Today's doses" value={medicines ? medicines * 2 : 0} icon={HeartPulse} />
        <Stat label="Upcoming reminders" value={reminders} icon={Bell} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Recent prescription</h2>
          {prescription ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold">{prescription.fileName}</div>
              <div className="mt-1 text-sm text-slate-500">{prescription.doctorName}</div>
              <p className="mt-3 text-sm text-slate-700">{prescription.summary}</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => setActiveTab("prescriptions")}
              >
                Open prescription
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No prescription uploaded yet.</p>
          )}
        </Card>

        <Card>
          <h2 className="font-bold">Today's medicine schedule</h2>
          {prescription?.medicines.length ? (
            <div className="mt-4 space-y-2">
              {prescription.medicines.map((medicine, index) => (
                <div key={medicine.id} className="rounded-xl bg-slate-50 p-3">
                  <div className="font-semibold">{index ? "08:00 PM" : "08:00 AM"} · {medicine.name}</div>
                  <div className="text-xs text-slate-500">{medicine.dosage} · {medicine.timing}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Your schedule appears after prescription processing.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <Icon size={19} />
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="mt-4 text-sm font-medium text-slate-500">{label}</div>
    </Card>
  );
}
