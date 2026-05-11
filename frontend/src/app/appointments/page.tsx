"use client";

import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Search, RefreshCw } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    dentistId: '',
    date: '',
    time: ''
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/appointments`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: parseInt(formData.patientId),
          dentistId: parseInt(formData.dentistId),
          date: formData.date,
          time: formData.time
        }),
      });
      if (!res.ok) throw new Error("Creation failed");
      setShowForm(false);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePayment = async (appointmentId: number, amount: number) => {
    try {
      const res = await fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          paymentMethod: 'Credit Card',
          appointmentId: appointmentId
        }),
      });
      if (!res.ok) throw new Error("Payment failed");
      fetchAppointments();
      alert("Payment Successful! SQL Trigger has updated the status to Completed.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Appointment Management</h3>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> New Appointment
        </button>
      </div>

      {/* New Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
            <h4 className="text-xl font-bold mb-6">Schedule Visit</h4>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID (Try 1 or 2)</label>
                <input required type="number" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dentist ID (Try 3)</label>
                <input required type="number" value={formData.dentistId} onChange={e => setFormData({...formData, dentistId: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Create Appointment</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="glass-card">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="animate-spin mb-4" size={40} />
            <p>Syncing with clinic database...</p>
          </div>
        ) : error ? (
          <div className="p-20 text-center text-red-500">
            <p>Error: {error}</p>
            <button onClick={fetchAppointments} className="mt-4 text-blue-600 font-bold underline">Try Again</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600">ID</th>
                  <th className="p-4 font-semibold text-slate-600">Patient</th>
                  <th className="p-4 font-semibold text-slate-600">Dentist</th>
                  <th className="p-4 font-semibold text-slate-600">Schedule</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((app) => (
                  <tr key={app.Appointment_ID} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-slate-500 font-mono text-sm">#{app.Appointment_ID}</td>
                    <td className="p-4 font-medium">{app.Patient?.Person?.First_Name} {app.Patient?.Person?.Last_Name}</td>
                    <td className="p-4 text-slate-600">Dr. {app.Dentist?.Person?.Last_Name}</td>
                    <td className="p-4 text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{new Date(app.Date).toLocaleDateString()}</span>
                        <span className="text-xs">{new Date(app.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {app.Status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                          <CheckCircle size={12} /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {app.Status === 'Pending' && (
                        <button 
                          onClick={() => handlePayment(app.Appointment_ID, 2500)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700"
                        >
                          Pay & Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-slate-400 italic">No appointments scheduled for today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
