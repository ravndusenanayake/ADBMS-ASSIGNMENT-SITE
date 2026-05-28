import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, Calendar, ClipboardList, Activity, Users, Settings, DollarSign } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LumiSmile Dental Care | Management System",
  description: "Next-generation dental clinic management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 p-6 flex flex-col gap-8 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 text-sky-600">
              <div className="p-2 bg-sky-50 rounded-xl shadow-sm border border-sky-100">
                <Activity size={28} strokeWidth={2.5} />
              </div>
              <h1 className="font-extrabold text-2xl tracking-tight text-slate-800">LumiSmile</h1>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              <Link href="/" className="nav-link nav-link-active">
                <Home size={20} /> Dashboard
              </Link>
              <Link href="/patients" className="nav-link">
                <Users size={20} /> Patients
              </Link>
              <Link href="/appointments" className="nav-link">
                <Calendar size={20} /> Appointments
              </Link>
              <Link href="/treatments" className="nav-link">
                <ClipboardList size={20} /> Treatments
              </Link>
              <Link href="/billing" className="nav-link">
                <DollarSign size={20} /> Billing
              </Link>
            </nav>
            
            <div className="mt-auto pt-8 border-t border-slate-100">
              <Link href="/settings" className="nav-link">
                <Settings size={20} /> Settings
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 flex justify-between items-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div>
                <p className="text-slate-500 text-sm font-medium">Welcome back,</p>
                <h2 className="text-xl font-bold text-slate-800">LumiSmile Staff</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
                  S
                </div>
              </div>
            </header>
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
