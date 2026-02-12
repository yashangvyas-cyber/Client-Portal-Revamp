import React, { useState } from 'react';
import { X, Info, Eye, EyeOff } from 'lucide-react';

interface AddWorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { timeSpent: string; date: string; description: string; isClientVisible: boolean }) => void;
}

export const AddWorkLogModal: React.FC<AddWorkLogModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [timeSpent, setTimeSpent] = useState('');
  const [date, setDate] = useState('2026-02-10'); // Default matching screenshot
  const [description, setDescription] = useState('');
  const [isClientVisible, setIsClientVisible] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ timeSpent, date, description, isClientVisible });
    onClose();
    setTimeSpent('');
    setDescription('');
    setIsClientVisible(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/20 backdrop-blur-[1px]">
      {/* Panel Container */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Add Work Log</h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                        Time Spent <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={timeSpent}
                        onChange={(e) => setTimeSpent(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        autoFocus
                        placeholder="e.g. 2h 30m"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Work Description
                </label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-32 resize-none"
                    placeholder="Add your work log here..."
                ></textarea>
            </div>

            {/* Visibility Toggle */}
            <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all flex items-start gap-3 ${isClientVisible ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}
                onClick={() => setIsClientVisible(!isClientVisible)}
            >
                <div className={`mt-0.5 p-1.5 rounded-full ${isClientVisible ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                    {isClientVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>
                <div>
                    <div className={`text-sm font-bold ${isClientVisible ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {isClientVisible ? 'Visible to Client' : 'Internal Only'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        {isClientVisible 
                            ? 'This log will be visible in the Client Portal.' 
                            : 'This log is hidden from the client but counts towards internal reporting.'}
                    </div>
                </div>
                <div className="ml-auto mt-0.5">
                    <div className={`w-10 h-5 rounded-full p-0.5 flex transition-colors ${isClientVisible ? 'bg-indigo-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                    </div>
                </div>
            </div>
            
             <div className="bg-white border border-slate-200 rounded-lg p-3 flex gap-3">
                <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-500">
                    <p className="font-bold text-slate-700 mb-1">Use the format: 4d 6h 45m</p>
                    <div className="flex gap-2 mb-1">
                        <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">d</span> = days
                        <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">h</span> = hours
                        <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">m</span> = minutes
                    </div>
                    <p>Maximum 24 hours are allowed in one entry.</p>
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0">
            <div className="flex justify-end gap-3">
                <button 
                    onClick={onClose} 
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                >
                    Submit
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};