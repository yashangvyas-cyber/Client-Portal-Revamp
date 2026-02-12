import React from 'react';
import { Project } from '../../../../types';
import { Search } from 'lucide-react';

interface ProjectLogsProps {
  project: Project;
}

export const ProjectLogs: React.FC<ProjectLogsProps> = ({ project }) => {
  // Mock Data matching screenshot
  const logs = [
    {
      id: 1,
      name: 'Harvey Spector',
      role: 'Business analyst',
      roleBadge: 'Business Analyst (BA)',
      avatar: 'HS',
      avatarColor: 'bg-purple-100 text-purple-600',
      loggedHours: '08:00'
    },
    {
      id: 2,
      name: 'Super User',
      role: 'Project manager',
      roleBadge: 'Project Manager (PM)',
      avatar: 'SU',
      avatarColor: 'bg-red-100 text-red-600',
      loggedHours: '08:00'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Project Logs</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Filter Results..." 
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
             />
          </div>
          <button className="px-6 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100">
             Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resource <span className="inline-block ml-1 text-[8px]">▼</span></th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role <span className="inline-block ml-1 text-[8px]">▼</span></th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
               Logged Hours <span className="inline-block ml-1 px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px]">16:00</span> <span className="inline-block ml-1 text-[8px]">▼</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log, index) => (
             <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-medium text-slate-800">{index + 1}</td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${log.avatarColor}`}>
                         {log.avatar}
                      </div>
                      <div>
                         <div className="text-sm font-bold text-slate-800">{log.name}</div>
                         <div className="text-xs text-slate-500">{log.role}</div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[10px] font-bold uppercase">
                      {log.roleBadge}
                   </span>
                </td>
                <td className="px-6 py-5 text-right font-bold text-slate-800 text-sm">
                   {log.loggedHours}
                </td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};