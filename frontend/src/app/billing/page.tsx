"use client";

import { useState, useEffect } from "react";
import { Search, CreditCard, Download, FileText } from "lucide-react";

export default function BillingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/payments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch payments:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Billing & Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Process payments and view transaction history</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <CreditCard size={18} /> New Invoice
        </button>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by invoice ID or patient name..." 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-sky-700 dark:hover:text-white transition-colors shadow-sm">
            <Download size={18} /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="data-table-header rounded-tl-xl">Invoice ID</th>
                <th className="data-table-header">Date</th>
                <th className="data-table-header">Patient</th>
                <th className="data-table-header">Method</th>
                <th className="data-table-header text-right">Amount</th>
                <th className="data-table-header text-right rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">No payment history found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.Payment_ID} className="data-table-row">
                    <td className="data-table-cell font-bold text-sky-700 dark:text-sky-400">
                      INV-{p.Payment_ID.toString().padStart(4, '0')}
                    </td>
                    <td className="data-table-cell font-medium">
                      {new Date(p.Date).toLocaleDateString()}
                    </td>
                    <td className="data-table-cell font-medium">
                      {p.Appointment?.Patient?.Person?.First_Name} {p.Appointment?.Patient?.Person?.Last_Name}
                    </td>
                    <td className="data-table-cell">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold shadow-sm">
                        {p.Payment_Method || 'Unknown'}
                      </span>
                    </td>
                    <td className="data-table-cell text-right text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                      ${p.Amount}
                    </td>
                    <td className="data-table-cell text-right">
                      <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors inline-flex items-center gap-2 text-xs font-bold">
                        <FileText size={16} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
