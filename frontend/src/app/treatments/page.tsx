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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Treatments</h1>
          <p className="text-slate-500 mt-1">Manage service catalog and pricing</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Treatment
        </button>
      </div>

      <div className="glass-card">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search treatments..." 
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500">Loading treatments...</div>
          ) : treatments.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
              <Activity size={48} className="mb-4 text-slate-300" />
              <p>No treatments found in the catalog.</p>
            </div>
          ) : (
            treatments.map((t) => (
              <div key={t.Treatment_ID} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-sky-200 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl shadow-sm border border-sky-100/50 group-hover:scale-110 transition-transform">
                    <Activity size={24} strokeWidth={2} />
                  </div>
                  <span className="text-sky-700 font-bold bg-sky-50 px-3 py-1 rounded-lg border border-sky-200/50 flex items-center gap-1 shadow-sm">
                    <DollarSign size={14} />
                    {t.Base_Price}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{t.Treatment_Name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Standard procedure for {t.Treatment_Name.toLowerCase()}. Includes full consultation.</p>
                <button className="w-full py-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-200 rounded-lg transition-colors text-sm font-semibold">
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
