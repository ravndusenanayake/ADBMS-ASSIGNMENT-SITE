"use client";

import { useState, useEffect } from "react";
import { Plus, Search, DollarSign, Activity } from "lucide-react";
import { NewTreatmentModal } from "@/components/NewTreatmentModal";

export default function TreatmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTreatments = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/treatments")
      .then((res) => res.json())
      .then((data) => {
        setTreatments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch treatments:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Treatments & Services</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage dental procedures and pricing</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Treatment
        </button>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search treatments..." 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">Loading treatments...</div>
          ) : treatments.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">No treatments found.</div>
          ) : (
            treatments.map((t) => (
              <div key={t.Treatment_ID} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-lg hover:border-sky-200 dark:hover:border-sky-500/30 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-500/20 shadow-sm group-hover:scale-110 transition-transform">
                    <Activity size={24} strokeWidth={2} />
                  </div>
                  <span className="flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400 text-lg bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <DollarSign size={16} /> {t.Base_Price}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.Treatment_Name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{t.Description || "No description provided."}</p>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-4 py-2 text-sm font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 rounded-lg transition-colors border border-sky-100 dark:border-sky-500/20 shadow-sm">Edit</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <NewTreatmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTreatments} 
      />
    </div>
  );
}
