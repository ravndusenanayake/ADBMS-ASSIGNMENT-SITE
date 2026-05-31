"use client";

import { Users, CalendarCheck, DollarSign, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = [
    { title: "Total Patients", value: "1,284", icon: Users, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-500/10", border: "border-sky-100 dark:border-sky-500/20" },
    { title: "Pending Appts", value: "12", icon: CalendarCheck, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20" },
    { title: "Revenue (MTD)", value: "$45,200", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 rounded-full border border-sky-100 dark:border-sky-500/20 text-sm font-bold shadow-sm">
          <Activity size={16} className="animate-pulse" /> Live Metrics
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`glass-card p-6 flex flex-col gap-4 border-t-4 ${stat.border}`}>
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm border border-slate-100/50 dark:border-white/5`}>
                <stat.icon size={26} strokeWidth={2} />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card relative overflow-hidden p-8 border-none group shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-blue-500 z-0"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-2xl font-bold text-white mb-3">Manage Appointments</h3>
            <p className="text-sky-50 mb-8 flex-1 leading-relaxed">
              Schedule new visits, update patient status, and process billing for today&apos;s scheduled operations.
            </p>
            <Link href="/appointments" className="inline-flex items-center justify-center gap-2 bg-white text-sky-700 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl">
              View Schedule <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="glass-card p-8 bg-white dark:bg-slate-800/50">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-sky-600 dark:text-sky-400" /> Clinic Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Database Connection</span>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold rounded-lg shadow-sm">ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Prisma Client</span>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold rounded-lg shadow-sm">HEALTHY</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Backend API</span>
              <span className="px-3 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20 text-xs font-bold rounded-lg shadow-sm">READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
