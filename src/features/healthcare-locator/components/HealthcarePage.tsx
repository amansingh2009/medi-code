"use client";

import { useState } from "react";
import { Hospital, MapPin, Search } from "lucide-react";
import { PageTitle } from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/Button";
import { HealthcareCard } from "./HealthcareCard";
import { findNearbyHealthcare } from "../services/healthcareLocatorService";
import type { HealthcareFacility } from "@/types/healthcare";

export function HealthcarePage() {
  const [location, setLocation] = useState("");
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const result = await findNearbyHealthcare(location);
    setFacilities(result);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Nearby Healthcare"
        description="Find pharmacies, hospitals, clinics and medical centres."
        icon={Hospital}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city, area or PIN code"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm"
            />
          </div>
          <Button onClick={search} disabled={loading}>
            <Search size={17} /> {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="mt-5 grid min-h-40 place-items-center rounded-2xl bg-slate-100 text-center text-slate-500">
          <div>
            <MapPin className="mx-auto" size={30} />
            <div className="mt-2 text-sm font-semibold">Maps integration</div>
            <div className="mt-1 text-xs">Connect Google Places through the server API.</div>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {facilities.map((facility) => (
          <HealthcareCard key={facility.id} facility={facility} />
        ))}
      </div>
    </div>
  );
}
