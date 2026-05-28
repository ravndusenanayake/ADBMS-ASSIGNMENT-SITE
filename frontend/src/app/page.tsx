"use client";

import { Users, CalendarCheck, DollarSign, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = [
    { title: "Total Patients", value: "1,284", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Pending Appts", value: "12", icon: CalendarCheck, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Revenue (MTD)", value: "$45,200", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-sm font-medium">
          <Activity size={16} className="animate-pulse" /> Live Metrics
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`glass-card p-6 flex flex-col gap-4 border-t-2 ${stat.border}`}>
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={26} strokeWidth={2} />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card relative overflow-hidden p-8 border-none group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-sky-500/80 z-0"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-2xl font-bold text-white mb-3">Manage Appointments</h3>
            <p className="text-blue-100 mb-8 flex-1 leading-relaxed">
              Schedule new visits, update patient status, and process billing for today's scheduled operations.
            </p>
            <Link href="/appointments" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl">
              View Schedule <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-blue-400" /> Clinic Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
              <span className="text-slate-300 font-medium">Database Connection</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.1)]">ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
              <span className="text-slate-300 font-medium">Prisma Client</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.1)]">HEALTHY</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
              <span className="text-slate-300 font-medium">Backend API</span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.1)]">READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
