import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, Calendar, ClipboardList, Activity } from "lucide-react";

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
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
            <div className="flex items-center gap-2 text-blue-600">
              <Activity size={32} strokeWidth={2.5} />
              <h1 className="font-bold text-xl tracking-tight text-slate-800">LumiSmile</h1>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link href="/" className="nav-link nav-link-active">
                <Home size={20} /> Dashboard
              </Link>
              <Link href="/appointments" className="nav-link">
                <Calendar size={20} /> Appointments
              </Link>
              <Link href="/treatments" className="nav-link">
                <ClipboardList size={20} /> Treatments
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <header className="flex justify-between items-center mb-8">
              <div>
                <p className="text-slate-500 text-sm">Welcome back,</p>
                <h2 className="text-2xl font-bold text-slate-800">LumiSmile Staff</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  S
                </div>
              </div>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
