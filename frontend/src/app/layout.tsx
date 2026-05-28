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
          <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col gap-8">
            <div className="flex items-center gap-3 text-blue-400">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Activity size={28} strokeWidth={2.5} />
              </div>
              <h1 className="font-bold text-2xl tracking-tight text-white">LumiSmile</h1>
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
            
            <div className="mt-auto pt-8 border-t border-white/10">
              <Link href="/settings" className="nav-link">
                <Settings size={20} /> Settings
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            <header className="sticky top-0 z-10 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">Welcome back,</p>
                <h2 className="text-xl font-bold text-white">LumiSmile Staff</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
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
