import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, Calendar, ClipboardList, Activity, Users, Settings, Banknote, Stethoscope } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-900 transition-colors duration-300`} suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/60 dark:border-white/10 p-6 flex flex-col gap-8 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none transition-colors duration-300">
              <div className="flex items-center gap-3 text-sky-600 dark:text-blue-400">
                <div className="p-2 bg-sky-50 dark:bg-blue-500/10 rounded-xl shadow-sm border border-sky-100 dark:border-blue-500/20">
                  <Activity size={28} strokeWidth={2.5} />
                </div>
                <h1 className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">LumiSmile</h1>
              </div>
              
              <nav className="flex flex-col gap-2 flex-1">
                <Link href="/" className="nav-link nav-link-active">
                  <Home size={20} /> Dashboard
                </Link>
                <Link href="/patients" className="nav-link">
                  <Users size={20} /> Patients
                </Link>
                <Link href="/dentists" className="nav-link">
                  <Stethoscope size={20} /> Dentists
                </Link>
                <Link href="/appointments" className="nav-link">
                  <Calendar size={20} /> Appointments
                </Link>
                <Link href="/treatments" className="nav-link">
                  <ClipboardList size={20} /> Treatments
                </Link>
                <Link href="/billing" className="nav-link">
                  <Banknote size={20} /> Billing
                </Link>
              </nav>
              
              <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/10 transition-colors duration-300">
                <Link href="/settings" className="nav-link">
                  <Settings size={20} /> Settings
                </Link>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
              <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 px-8 py-5 flex justify-between items-center shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none transition-colors duration-300">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Welcome back,</p>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">LumiSmile Staff</h2>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 dark:from-blue-600 dark:to-sky-500 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20 dark:shadow-blue-500/20">
                    S
                  </div>
                </div>
              </header>
              <div className="p-8">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
