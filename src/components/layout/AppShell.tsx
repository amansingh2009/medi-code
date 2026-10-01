"use client";

import { useState } from "react";
import { Bell, HeartPulse, LogIn, LogOut, Menu, ShieldCheck } from "lucide-react";
import { navigationItems, type NavigationId } from "@/constants/navigation";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useAppStore } from "@/features/app/hooks/useAppStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { session, signIn, signOut } = useAuth();
  const { activeTab, setActiveTab, language, setLanguage } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => setActiveTab("dashboard")} className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-600 text-white">
              <HeartPulse size={22} />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold">MediDecode</div>
              <div className="hidden text-xs text-slate-500 sm:block">
                Understand your prescription simply
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>

            {session ? (
              <Button variant="secondary" onClick={signOut}>
                <LogOut size={16} /> Sign out
              </Button>
            ) : (
              <Button onClick={signIn}>
                <LogIn size={16} /> Sign in with Google
              </Button>
            )}
          </div>

          <button
            className="rounded-xl p-2 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <Menu />
          </button>
        </div>

        {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold",
                    activeTab === item.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-2">
              <ShieldCheck className="mt-0.5 shrink-0 text-amber-700" size={18} />
              <div>
                <div className="text-sm font-bold text-amber-900">Medical safety</div>
                <p className="mt-1 text-xs leading-5 text-amber-800">
                  Verify dosage, substitutions and unclear prescription details with a qualified doctor or pharmacist.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs leading-5 text-slate-500">
        MediDecode provides informational assistance and does not replace advice from a qualified doctor or pharmacist.
      </footer>
    </div>
  );
}
