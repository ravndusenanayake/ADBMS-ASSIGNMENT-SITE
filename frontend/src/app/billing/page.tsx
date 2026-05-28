"use client";

import { useState, useEffect } from "react";
import { DollarSign, Search, CreditCard, Download, FileText } from "lucide-react";

export default function BillingPage() {
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Billing & Payments</h1>
          <p className="text-slate-400 mt-1">Process payments and view transaction history</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <CreditCard size={18} /> New Invoice
        </button>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-white/10 flex gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by invoice ID or patient name..." 
              className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
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
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No payment history found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.Payment_ID} className="data-table-row hover:bg-white/5 transition-colors">
                    <td className="data-table-cell font-medium text-slate-300">
                      INV-{p.Payment_ID.toString().padStart(4, '0')}
                    </td>
                    <td className="data-table-cell">
                      {new Date(p.Date).toLocaleDateString()}
                    </td>
                    <td className="data-table-cell">
                      {p.Appointment?.Patient?.Person?.First_Name} {p.Appointment?.Patient?.Person?.Last_Name}
                    </td>
                    <td className="data-table-cell">
                      <span className="px-2 py-1 bg-slate-800 rounded border border-white/10 text-xs font-medium">
                        {p.Payment_Method || 'Unknown'}
                      </span>
                    </td>
                    <td className="data-table-cell text-right text-emerald-400 font-bold">
                      ${p.Amount}
                    </td>
                    <td className="data-table-cell text-right">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors inline-flex items-center gap-2 text-xs">
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
