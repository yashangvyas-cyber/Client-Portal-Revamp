import React from 'react';
import { InternalModule, User } from '../types';
import { 
  LayoutDashboard, 
  Folder, 
  CheckSquare, 
  MessageSquare, 
  CalendarDays, 
  PieChart, 
  FileText, 
  Clock, 
  Briefcase, 
  Settings,
  Users
} from 'lucide-react';

interface InternalSidebarProps {
  activeModule: InternalModule;
  onSelectModule: (module: InternalModule) => void;
  currentUser: User;
}

export const InternalSidebar: React.FC<InternalSidebarProps> = ({ activeModule, onSelectModule, currentUser }) => {
  
  const menuItems = [
    { id: InternalModule.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: InternalModule.PROJECTS, label: 'Projects', icon: Folder },
    { id: InternalModule.TASKS, label: 'Tasks', icon: CheckSquare },
    { id: InternalModule.MESSAGES, label: 'Client Messages', icon: MessageSquare },
    { id: InternalModule.ALLOCATION, label: 'Daily Allocation', icon: CalendarDays },
  ];

  const reportItems = [
    { id: InternalModule.OCCUPANCY_REPORT, label: 'Occupancy Report', icon: Users },
    { id: InternalModule.TIMESHEET_REPORT, label: 'Timesheet Reports', icon: Clock },
    { id: InternalModule.HIREBASE_REPORT, label: 'Hirebase Report', icon: Briefcase },
    { id: InternalModule.HOURLY_REPORT, label: 'Hourly Report', icon: PieChart },
    { id: InternalModule.FIXED_REPORT, label: 'Fixed Cost Report', icon: FileText },
  ];

  return (
    <div className="w-72 bg-[#1a1a27] text-slate-300 flex flex-col h-[calc(100vh-72px)] fixed left-0 bottom-0 z-10 shadow-xl border-t border-slate-800 overflow-y-auto">
      <div className="p-4 space-y-1 mt-4">
        
        {/* Main Menu */}
        <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Project Management</div>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectModule(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeModule === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeModule === item.id ? 'text-white' : 'text-slate-400'}`} />
            {item.label}
          </button>
        ))}

        <div className="my-4 border-t border-white/5 mx-4"></div>

        {/* Reports */}
        <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reports & Analytics</div>
        {reportItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectModule(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeModule === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeModule === item.id ? 'text-white' : 'text-slate-400'}`} />
            {item.label}
          </button>
        ))}

        <div className="my-4 border-t border-white/5 mx-4"></div>

        {/* Config */}
        <button
          onClick={() => onSelectModule(InternalModule.CONFIG)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
            activeModule === InternalModule.CONFIG 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
              : 'hover:bg-white/5 hover:text-white'
          }`}
        >
          <Settings className={`w-5 h-5 ${activeModule === InternalModule.CONFIG ? 'text-white' : 'text-slate-400'}`} />
          Config
        </button>

      </div>
      
      <div className="mt-auto p-6 border-t border-white/5 bg-[#13131f]">
         <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
             <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">HS</div>
             <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate uppercase tracking-wider">{currentUser.role}</div>
             </div>
         </div>
      </div>
    </div>
  );
};