"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Stethoscope, MoreVertical } from "lucide-react";
import { NewDentistModal } from "@/components/NewDentistModal";

export default function DentistsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dentists, setDentists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDentists = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/dentists")
      .then((res) => res.json())
      .then((data) => {
        setDentists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dentists:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDentists();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Dentists</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage dentists and their specialties</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Dentist
        </button>
      </div>

      <div className="glass-card flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search dentists by name or SLMC No..." 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="data-table-header rounded-tl-xl">Dentist Info</th>
                <th className="data-table-header">SLMC Reg No</th>
                <th className="data-table-header">Specialization</th>
                <th className="data-table-header">Contact Number</th>
                <th className="data-table-header text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">Loading dentists...</td>
                </tr>
              ) : dentists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">No dentists found.</td>
                </tr>
              ) : (
                dentists.map((dentist) => (
                  <tr key={dentist.Dentist_ID} className="data-table-row group">
                    <td className="data-table-cell">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-700 transition-colors shadow-sm">
                          <Stethoscope size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">Dr. {dentist.Person?.First_Name} {dentist.Person?.Last_Name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">ID: {dentist.Dentist_ID}</div>
                        </div>
                      </div>
                    </td>
                    <td className="data-table-cell font-medium">{dentist.SLMC_Reg_No}</td>
                    <td className="data-table-cell">{dentist.Specialization}</td>
                    <td className="data-table-cell">{dentist.Person?.Contact_Number}</td>
                    <td className="data-table-cell text-right">
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-white/10 dark:hover:text-white rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-white/10 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="font-medium">Showing {dentists.length} dentists</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-50 shadow-sm font-medium" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-50 shadow-sm font-medium" disabled>Next</button>
          </div>
        </div>
      </div>
      
      <NewDentistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDentists} 
      />
    </div>
  );
}
