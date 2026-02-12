import React from 'react';
import { HardHat } from 'lucide-react';

interface PlaceholderTabProps {
  title: string;
}

export const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <HardHat className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-1">{title} View</h3>
      <p className="text-slate-400 text-sm">This module is currently under development.</p>
    </div>
  );
};