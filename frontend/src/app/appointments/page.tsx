"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, XCircle, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch appointments:", err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Cancelled": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your clinic's schedule</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Side (Simplified representation) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">May 2026</h3>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {/* Mock Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-slate-400 font-bold pb-2">{day}</div>
              ))}
              {/* Padding days */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`pad-${i}`} className="p-2 text-slate-300"></div>
              ))}
              {/* Days */}
              {Array.from({ length: 31 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded-lg cursor-pointer transition-colors font-medium ${
                    i + 1 === 28 ? 'bg-sky-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-slate-600 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500/50" defaultChecked />
                Show All Doctors
              </label>
              <label className="flex items-center gap-3 text-slate-600 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500/50" defaultChecked />
                Pending
              </label>
              <label className="flex items-center gap-3 text-slate-600 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500/50" defaultChecked />
                Completed
              </label>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-xl font-bold text-slate-800">Thursday, May 28</h2>
            <span className="text-slate-500 font-medium text-sm">{appointments.length} appointments</span>
          </div>

          {loading ? (
            <div className="glass-card p-12 text-center text-slate-500 font-medium">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center">
              <CalendarIcon size={48} className="mb-4 text-slate-300" />
              <p className="font-medium">No appointments scheduled for this day.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.Appointment_ID} className="glass-card p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md hover:border-sky-200 transition-all duration-300 group bg-white">
                <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100 pr-6">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-lg mb-2 shadow-sm border border-sky-100">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-extrabold text-slate-800 text-lg">
                    {new Date(apt.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                        {apt.Patient?.Person?.First_Name} {apt.Patient?.Person?.Last_Name}
                      </h3>
                      <div className="text-slate-500 font-medium flex items-center gap-2 text-sm mb-4">
                        <User size={14} className="text-slate-400" /> Dr. {apt.Dentist?.Person?.Last_Name}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg border shadow-sm ${getStatusColor(apt.Status)}`}>
                      {apt.Status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-100">
                    <div className="flex gap-2">
                      {apt.Treatments && apt.Treatments.length > 0 ? (
                        apt.Treatments.map((t: any) => (
                          <span key={t.Treatment_ID} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                            {t.Treatment?.Treatment_Name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 font-medium border border-dashed border-slate-200 px-2 py-1 rounded-lg">No treatments selected</span>
                      )}
                    </div>
                    
                    {apt.Status === 'Pending' && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-colors shadow-sm" title="Mark Completed">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg transition-colors shadow-sm" title="Cancel">
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
