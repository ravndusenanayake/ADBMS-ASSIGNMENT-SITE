import { Users, CalendarCheck, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const stats = [
    { title: "Total Patients", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Pending Appts", value: "12", icon: CalendarCheck, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Revenue (MTD)", value: "$45,200", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none">
          <h3 className="text-xl font-bold mb-2">Manage Appointments</h3>
          <p className="text-blue-100 mb-6">Schedule new visits, update patient status, and process billing for today's visits.</p>
          <Link href="/appointments" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
            View Schedule <ArrowRight size={18} />
          </Link>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Clinic Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Database Connection</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Prisma Client</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">HEALTHY</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Next.js API Routes</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
