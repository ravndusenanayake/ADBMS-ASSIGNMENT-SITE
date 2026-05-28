"use client";

import { useState, useEffect } from "react";
import { Plus, Search, User, MoreVertical } from "lucide-react";

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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Patients</h1>
          <p className="text-slate-500 mt-1">Manage patient records and histories</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Patient
        </button>
      </div>

      <div className="glass-card flex flex-col">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients by name or NIC..." 
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all shadow-sm"
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
                  <td colSpan={5} className="text-center py-12 text-slate-500">Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">No patients found.</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.Patient_ID} className="data-table-row group">
                    <td className="data-table-cell">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors shadow-sm">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{patient.Person?.First_Name} {patient.Person?.Last_Name}</div>
                          <div className="text-xs text-slate-500 font-medium">ID: {patient.Patient_ID}</div>
                        </div>
                      </div>
                    </td>
                    <td className="data-table-cell font-medium">{patient.Person?.NIC}</td>
                    <td className="data-table-cell">{patient.Person?.Contact_Number || "-"}</td>
                    <td className="data-table-cell">
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 shadow-sm">
                        {patient.Blood_Group || "Unknown"}
                      </span>
                    </td>
                    <td className="data-table-cell text-right">
                      <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500 bg-slate-50/50">
          <div className="font-medium">Showing {patients.length} patients</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50 shadow-sm font-medium" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50 shadow-sm font-medium" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
