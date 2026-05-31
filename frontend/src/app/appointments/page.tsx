"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, XCircle, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { BookAppointmentModal } from "@/components/BookAppointmentModal";

export default function AppointmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
      case "Completed": return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
      case "Cancelled": return "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20";
      default: return "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your clinic&apos;s schedule</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Side (Simplified representation) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">May 2026</h3>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {/* Mock Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-slate-400 dark:text-slate-500 font-bold pb-2">{day}</div>
              ))}
              {/* Padding days */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`pad-${i}`} className="p-2 text-slate-300 dark:text-slate-700"></div>
              ))}
              {/* Days */}
              {Array.from({ length: 31 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded-lg cursor-pointer transition-colors font-medium ${
                    i + 1 === 28 ? 'bg-sky-600 dark:bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-white/10 hover:text-sky-700 dark:hover:text-white'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-white/10 dark:bg-slate-800 text-sky-600 dark:text-blue-600 focus:ring-sky-500/50" defaultChecked />
                Show All Doctors
              </label>
              <label className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-white/10 dark:bg-slate-800 text-sky-600 dark:text-blue-600 focus:ring-sky-500/50" defaultChecked />
                Pending
              </label>
              <label className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-white/10 dark:bg-slate-800 text-sky-600 dark:text-blue-600 focus:ring-sky-500/50" defaultChecked />
                Completed
              </label>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Thursday, May 28</h2>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{appointments.length} appointments</span>
          </div>

          {loading ? (
            <div className="glass-card p-12 text-center text-slate-500 dark:text-slate-400 font-medium">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
              <CalendarIcon size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
              <p className="font-medium">No appointments scheduled for this day.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.Appointment_ID} className="glass-card p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md hover:border-sky-200 dark:hover:border-blue-500/30 transition-all duration-300 group bg-white dark:bg-transparent">
                <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100 dark:border-white/10 pr-6">
                  <div className="p-2 bg-sky-50 dark:bg-blue-500/10 text-sky-600 dark:text-blue-400 rounded-lg mb-2 shadow-sm border border-sky-100 dark:border-blue-500/20">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-extrabold text-slate-800 dark:text-white text-lg">
                    {new Date(apt.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                        {apt.Patient?.Person?.First_Name} {apt.Patient?.Person?.Last_Name}
                      </h3>
                      <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 text-sm mb-4">
                        <User size={14} className="text-slate-400 dark:text-slate-500" /> Dr. {apt.Dentist?.Person?.Last_Name}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg border shadow-sm ${getStatusColor(apt.Status)}`}>
                      {apt.Status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex gap-2">
                      {apt.Treatments && apt.Treatments.length > 0 ? (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        apt.Treatments.map((t: any) => (
                          <span key={t.Treatment_ID} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                            {t.Treatment?.Treatment_Name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium border border-dashed border-slate-200 dark:border-white/20 px-2 py-1 rounded-lg">No treatments selected</span>
                      )}
                    </div>
                    
                    {apt.Status === 'Pending' && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/20 rounded-lg transition-colors shadow-sm" title="Mark Completed">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/20 rounded-lg transition-colors shadow-sm" title="Cancel">
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
      
      <BookAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAppointments} 
      />
    </div>
  );
}
