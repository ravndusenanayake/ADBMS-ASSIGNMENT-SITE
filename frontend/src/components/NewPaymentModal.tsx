"use client";

import { useState, useEffect } from "react";
import { X, Calendar, CreditCard, Banknote } from "lucide-react";

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewPaymentModal({ isOpen, onClose, onSuccess }: NewPaymentModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [appointmentId, setAppointmentId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [amountTendered, setAmountTendered] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:5000/api/appointments")
        .then(res => res.json())
        .then(data => {
          // Only show pending appointments
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pending = data.filter((a: any) => a.Status === 'Pending');
          setAppointments(pending);
        })
        .catch(err => console.error("Failed to fetch appointments:", err));
    }
  }, [isOpen]);


  // Calculate amount based on the selected appointment
  const selectedAppointment = appointments.find(a => a.Appointment_ID.toString() === appointmentId);

  useEffect(() => {
    if (appointmentId && appointments.length > 0) {
      const selected = appointments.find(a => a.Appointment_ID.toString() === appointmentId);
      const calculatedAmount = selected?.Treatments?.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum: number, t: any) => sum + parseFloat(t.Treatment.Base_Price),
        0
      ) || 0;
      setAmount(calculatedAmount > 0 ? calculatedAmount.toFixed(2) : "");
    } else {
      setAmount("");
    }
  }, [appointmentId, appointments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(amount || "0");
    const tendered = parseFloat(amountTendered || "0");
    
    if (!appointmentId) return alert("Please select an appointment.");
    if (finalAmount <= 0) return alert("Total amount must be greater than zero.");
    
    if (paymentMethod === "Cash") {
      if (tendered < finalAmount) {
        return alert("Amount tendered cannot be less than the total amount.");
      }
    }

    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: parseInt(appointmentId),
          amount: finalAmount,
          paymentMethod
        })
      });
      
      if (response.ok) {
        onSuccess();
        onClose();
        setAppointmentId("");
        setPaymentMethod("Cash");
        setAmount("");
        setAmountTendered("");
      } else {
        const errorData = await response.json();
        alert(`Failed to process payment: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing the payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md bg-white dark:bg-slate-900 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">New Payment Invoice</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pending Appointment</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  required
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all appearance-none"
                >
                  <option value="" disabled>Select an appointment</option>
                  {appointments.map((a) => (
                    <option key={a.Appointment_ID} value={a.Appointment_ID}>
                      {new Date(a.Date).toLocaleDateString()} - {a.Patient?.Person?.First_Name} {a.Patient?.Person?.Last_Name} (Dr. {a.Dentist?.Person?.Last_Name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Total Amount (Rs.)</label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-extrabold focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                />
              </div>
              {appointmentId && selectedAppointment?.Treatments?.length > 0 && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-white/5">
                  <p className="font-bold mb-1">Included Treatments:</p>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {selectedAppointment.Treatments.map((t: any) => (
                    <div key={t.Treatment_ID} className="flex justify-between">
                      <span>{t.Treatment.Treatment_Name}</span>
                      <span>Rs. {t.Treatment.Base_Price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  required
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    if (e.target.value !== "Cash") setAmountTendered("");
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all appearance-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {paymentMethod === "Cash" && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-white/10">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cash Given</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Balance</label>
                  <div className={`w-full rounded-xl px-4 py-2 font-bold ${
                    parseFloat(amountTendered || "0") - parseFloat(amount || "0") >= 0 
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" 
                      : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                  }`}>
                    Rs. {amount && amountTendered 
                      ? (parseFloat(amountTendered) - parseFloat(amount)).toFixed(2) 
                      : "0.00"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 flex gap-3 border-t border-slate-100 dark:border-white/10">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !appointmentId || parseFloat(amount || "0") <= 0 || (paymentMethod === "Cash" && parseFloat(amountTendered || "0") < parseFloat(amount || "0"))}
              className="flex-1 btn-primary text-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Process Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
