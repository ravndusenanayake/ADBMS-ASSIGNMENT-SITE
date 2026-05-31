"use client";

import { useState, useEffect } from "react";
import { X, Printer, Activity } from "lucide-react";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: number | null;
}

export function ReceiptModal({ isOpen, onClose, paymentId }: ReceiptModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && paymentId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/payments/${paymentId}`)
        .then(res => res.json())
        .then(data => {
          setPayment(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch payment details:", err);
          setLoading(false);
        });
    } else {
      setPayment(null);
    }
  }, [isOpen, paymentId]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 print:bg-transparent print:backdrop-blur-none">
      
      {/* Modal Container - hidden when printing, only content prints */}
      <div className="glass-card w-full max-w-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] print:shadow-none print:w-full print:max-w-none print:border-none print:bg-white print:dark:bg-white">
        
        {/* Header (No Print) */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10 print:hidden shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Receipt / Invoice</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              disabled={loading || !payment}
              className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 font-semibold rounded-xl hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors disabled:opacity-50"
            >
              <Printer size={18} /> Print
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-slate-900/50 print:bg-white print:dark:bg-white print:p-0 print:overflow-visible">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-slate-500">Loading receipt details...</div>
          ) : payment ? (
            
            /* Printable Receipt Area */
            <div id="printable-receipt" className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 print:shadow-none print:border-none print:text-black print:dark:text-black">
              
              {/* Receipt Header */}
              <div className="flex justify-between items-start mb-10 pb-6 border-b-2 border-slate-100 print:border-slate-300">
                <div className="flex items-center gap-3 text-sky-600 print:text-black">
                  <div className="p-2 bg-sky-50 rounded-xl border border-sky-100 print:border-black print:bg-transparent">
                    <Activity size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white print:text-black">LumiSmile</h1>
                    <p className="text-xs font-semibold text-slate-500 print:text-gray-600 uppercase tracking-widest">Dental Care</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-slate-200 dark:text-slate-700 uppercase print:text-gray-300">Invoice</h2>
                  <p className="font-bold text-slate-700 dark:text-slate-300 print:text-black mt-1">INV-{payment.Payment_ID.toString().padStart(4, '0')}</p>
                  <p className="text-sm text-slate-500 print:text-gray-600">{new Date(payment.Date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Patient and Dentist Info */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 print:text-gray-500">Billed To</h3>
                  <p className="font-bold text-lg text-slate-800 dark:text-white print:text-black">
                    {payment.Appointment?.Patient?.Person?.First_Name} {payment.Appointment?.Patient?.Person?.Last_Name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 print:text-gray-600">
                    NIC: {payment.Appointment?.Patient?.Person?.NIC}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 print:text-gray-600">
                    Phone: {payment.Appointment?.Patient?.Person?.Contact_Number || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 print:text-gray-500">Service Provider</h3>
                  <p className="font-bold text-slate-800 dark:text-white print:text-black">
                    Dr. {payment.Appointment?.Dentist?.Person?.First_Name} {payment.Appointment?.Dentist?.Person?.Last_Name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 print:text-gray-600">
                    {payment.Appointment?.Dentist?.Specialization}
                  </p>
                </div>
              </div>

              {/* Treatments Table */}
              <div className="mb-10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-100 print:border-slate-300">
                      <th className="py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider print:text-gray-600">Description</th>
                      <th className="py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider print:text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                    {payment.Appointment?.Treatments && payment.Appointment.Treatments.length > 0 ? (
                      payment.Appointment.Treatments.map((t: any) => (
                        <tr key={t.Treatment_ID}>
                          <td className="py-4 text-slate-800 dark:text-slate-200 font-medium print:text-black">
                            {t.Treatment.Treatment_Name}
                          </td>
                          <td className="py-4 text-right text-slate-800 dark:text-slate-200 font-medium print:text-black">
                            Rs. {parseFloat(t.Treatment.Base_Price).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 text-slate-800 dark:text-slate-200 font-medium print:text-black">Consultation / Custom Service</td>
                        <td className="py-4 text-right text-slate-800 dark:text-slate-200 font-medium print:text-black">Rs. {parseFloat(payment.Amount).toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-1/2 min-w-[250px]">
                  <div className="flex justify-between py-3 border-t-2 border-slate-100 print:border-slate-300">
                    <span className="font-bold text-slate-600 dark:text-slate-300 print:text-gray-700">Subtotal</span>
                    <span className="font-bold text-slate-800 dark:text-white print:text-black">Rs. {parseFloat(payment.Amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-4 border-t-4 border-sky-500 print:border-black mt-2">
                    <span className="font-black text-lg text-slate-800 dark:text-white print:text-black uppercase">Total Paid</span>
                    <span className="font-black text-xl text-sky-600 dark:text-sky-400 print:text-black">Rs. {parseFloat(payment.Amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2 pt-4 border-t border-slate-100 print:border-slate-200">
                    <span className="text-sm font-semibold text-slate-500 print:text-gray-600">Payment Method</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 print:text-black uppercase">{payment.Payment_Method}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t border-slate-100 text-center print:border-slate-300">
                <p className="font-semibold text-slate-600 dark:text-slate-400 print:text-gray-700">Thank you for choosing LumiSmile Dental Care!</p>
                <p className="text-xs text-slate-400 print:text-gray-500 mt-2">If you have any questions concerning this invoice, please contact our support.</p>
              </div>

            </div>
          ) : (
            <div className="text-center text-red-500">Failed to load payment details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
