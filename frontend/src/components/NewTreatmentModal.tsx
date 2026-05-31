"use client";

import { useState } from "react";
import { X, Activity, DollarSign } from "lucide-react";

interface NewTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewTreatmentModal({ isOpen, onClose, onSuccess }: NewTreatmentModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [treatmentName, setTreatmentName] = useState("");
  const [basePrice, setBasePrice] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatmentName,
          basePrice: parseFloat(basePrice)
        })
      });
      
      if (response.ok) {
        onSuccess();
        onClose();
        setTreatmentName("");
        setBasePrice("");
      } else {
        const errorData = await response.json();
        alert(`Failed to add treatment: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the treatment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md bg-white dark:bg-slate-900 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Add New Treatment</h2>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Treatment Name</label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all"
                  placeholder="e.g. Root Canal"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Base Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none transition-all"
                  placeholder="150.00"
                />
              </div>
            </div>
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
              disabled={loading}
              className="flex-1 btn-primary text-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Treatment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
