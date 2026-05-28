"use client";

import { useState, useEffect } from "react";
import { Plus, Search, User, MoreVertical, Edit, Trash } from "lucide-react";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch patients:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Patients</h1>
          <p className="text-slate-400 mt-1">Manage patient records and histories</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Patient
        </button>
      </div>

      <div className="glass-card flex flex-col">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search patients by name or NIC..." 
              className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="data-table-header rounded-tl-xl">Patient Info</th>
                <th className="data-table-header">NIC</th>
                <th className="data-table-header">Contact</th>
                <th className="data-table-header">Blood Group</th>
                <th className="data-table-header text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">No patients found.</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.Patient_ID} className="data-table-row group">
                    <td className="data-table-cell">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 group-hover:border-blue-500/30 transition-colors">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-200">{patient.Person?.First_Name} {patient.Person?.Last_Name}</div>
                          <div className="text-xs text-slate-500">ID: {patient.Patient_ID}</div>
                        </div>
                      </div>
                    </td>
                    <td className="data-table-cell">{patient.Person?.NIC}</td>
                    <td className="data-table-cell">{patient.Person?.Contact_Number || "-"}</td>
                    <td className="data-table-cell">
                      <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium border border-red-500/20">
                        {patient.Blood_Group || "Unknown"}
                      </span>
                    </td>
                    <td className="data-table-cell text-right">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm text-slate-400">
          <div>Showing {patients.length} patients</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
