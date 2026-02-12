import React from 'react';
import { InternalModule } from '../../types';
import { PieChart, FileText, Briefcase, Clock, Users } from 'lucide-react';

interface InternalReportsProps {
  module: InternalModule;
}

export const InternalReports: React.FC<InternalReportsProps> = ({ module }) => {
  const getReportInfo = () => {
    switch (module) {
      case InternalModule.OCCUPANCY_REPORT: return { title: 'Occupancy Report', icon: Users, desc: 'Resource utilization across projects.' };
      case InternalModule.TIMESHEET_REPORT: return { title: 'Timesheet Reports', icon: Clock, desc: 'Detailed developer time logs.' };
      case InternalModule.HIREBASE_REPORT: return { title: 'Hirebase Report', icon: Briefcase, desc: 'Contractor and resource expiration tracking.' };
      case InternalModule.HOURLY_REPORT: return { title: 'Hourly Report', icon: PieChart, desc: 'Top-up consumption and billing status.' };
      case InternalModule.FIXED_REPORT: return { title: 'Fixed Cost Report', icon: FileText, desc: 'Milestone tracking and invoicing.' };
      case InternalModule.ALLOCATION: return { title: 'Daily Allocation', icon: CalendarDays, desc: 'Team resource planning.' };
      default: return { title: 'Report', icon: FileText, desc: 'Select a report to view.' };
    }
  };

  const info = getReportInfo();
  // Needed for Icon component rendering
  const CalendarDays = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
  );

  return (
    <div className="animate-fade-in h-full flex flex-col items-center justify-center text-slate-400">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <info.icon className="w-10 h-10 text-slate-300" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{info.title}</h2>
      <p className="max-w-md text-center">{info.desc}</p>
    </div>
  );
};