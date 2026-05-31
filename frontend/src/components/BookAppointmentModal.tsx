"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Clock, User, UserRound, Activity } from "lucide-react";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookAppointmentModal({ isOpen, onClose, onSuccess }: BookAppointmentModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patients, setPatients] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dentists, setDentists] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [patientId, setPatientId] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch("http://localhost:5000/api/patients").then(res => res.json()),
        fetch("http://localhost:5000/api/dentists").then(res => res.json()),
        fetch("http://localhost:5000/api/treatments").then(res => res.json())
      ]).then(([patientsData, dentistsData, treatmentsData]) => {
        setPatients(patientsData);
        setDentists(dentistsData);
        setTreatments(treatmentsData);
      }).catch(err => console.error("Failed to fetch data:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: parseInt(patientId),
          dentistId: parseInt(dentistId),
          date,
          time,
          treatmentIds: selectedTreatments
        })
      });
      
      if (response.ok) {
        onSuccess();
        onClose();
        setPatientId("");
        setDentistId("");
        setDate("");
        setTime("");
        setSelectedTreatments([]);
      } else {
        const errorData = await response.json();
        alert(`Failed to book appointment: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md bg-white dark:bg-slate-900 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Book Appointment</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Patient</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all appearance-none"
              >
                <option value="" disabled>Select a patient</option>
                {patients.map((p) => (
                  <option key={p.Patient_ID} value={p.Patient_ID}>
                    {p.Person?.First_Name} {p.Person?.Last_Name} (NIC: {p.Person?.NIC})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Dentist</label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                required
                value={dentistId}
                onChange={(e) => setDentistId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all appearance-none"
              >
                <option value="" disabled>Select a dentist</option>
                {dentists.map((d) => (
                  <option key={d.Dentist_ID} value={d.Dentist_ID}>
                    Dr. {d.Person?.First_Name} {d.Person?.Last_Name} ({d.Specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Treatments</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto p-1 pr-2">
              {treatments.map((t) => {
                const strId = t.Treatment_ID.toString();
                const isSelected = selectedTreatments.includes(strId);
                return (
                  <button
                    type="button"
                    key={t.Treatment_ID}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTreatments(selectedTreatments.filter(id => id !== strId));
                      } else {
                        setSelectedTreatments([...selectedTreatments, strId]);
                      }
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? "bg-sky-50 border-sky-500 shadow-[0_2px_10px_-3px_rgba(14,165,233,0.3)] dark:bg-sky-500/10 dark:border-sky-500/50" 
                        : "bg-white border-slate-200 hover:border-sky-300 hover:shadow-sm dark:bg-slate-800 dark:border-white/10 dark:hover:border-sky-500/30"
                    }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-md border transition-colors ${
                      isSelected ? "bg-sky-500 border-sky-500 text-white dark:bg-sky-500 dark:border-sky-500" : "border-slate-300 dark:border-slate-600"
                    }`}>
                      {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isSelected ? "text-sky-900 dark:text-sky-100" : "text-slate-700 dark:text-slate-300"}`}>
                        {t.Treatment_Name}
                      </div>
                      <div className={`text-xs mt-0.5 font-medium ${isSelected ? "text-sky-700 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"}`}>
                        Rs. {t.Base_Price}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="time" 
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn-primary text-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
