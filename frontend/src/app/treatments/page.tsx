"use client";

import { useState, useEffect } from "react";
import { Plus, Search, DollarSign, Activity } from "lucide-react";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Treatments</h1>
          <p className="text-slate-400 mt-1">Manage service catalog and pricing</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Treatment
        </button>
      </div>

      <div className="glass-card">
        <div className="p-6 border-b border-white/10 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search treatments..." 
              className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400">Loading treatments...</div>
          ) : treatments.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 flex flex-col items-center">
              <Activity size={48} className="mb-4 text-slate-600" />
              <p>No treatments found in the catalog.</p>
            </div>
          ) : (
            treatments.map((t) => (
              <div key={t.Treatment_ID} className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Activity size={24} />
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                    <DollarSign size={14} />
                    {t.Base_Price}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t.Treatment_Name}</h3>
                <p className="text-sm text-slate-400 mb-6">Standard procedure for {t.Treatment_Name.toLowerCase()}.</p>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">
                  Edit Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
