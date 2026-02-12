import React from 'react';
import { Project } from '../../../../types';
import { RefreshCw, MoreVertical, MessageSquare, Trash2, CheckCircle, ChevronDown } from 'lucide-react';

interface ProjectBillingProps {
  project: Project;
}

export const ProjectBilling: React.FC<ProjectBillingProps> = ({ project }) => {
  // Mock Data
  const billingRecords = [
    {
      id: 1,
      name: 'Harvey Spector',
      avatar: 'HS',
      avatarColor: 'bg-purple-100 text-purple-600',
      ticketId: 'ALPHA-13',
      date: '05/Feb/2026',
      description: 'Here for the 1234',
      spent: '08:00',
      billed: '04:00'
    },
    {
      id: 2,
      name: 'Super User',
      avatar: 'SU',
      avatarColor: 'bg-red-100 text-red-600',
      ticketId: 'ALPHA-12',
      date: '05/Feb/2026',
      description: 'Testing',
      spent: '08:00',
      billed: '12:00'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-800">Billing</h3>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
             1 - {billingRecords.length} of {billingRecords.length} Records
          </span>
          <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-indigo-600">
             <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
           <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              Enable Public Timesheet Link
           </label>
           
           <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-indigo-200 transition-all">
              Add manually
           </button>
           
           <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
              <MoreVertical className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
         <div className="flex gap-3">
            <div className="relative">
               <select className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-1.5 rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:border-indigo-300 w-40">
                  <option>Resource</option>
                  <option>Harvey Spector</option>
               </select>
               <ChevronDown className="absolute right-3 top-2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="relative">
               <select className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-1.5 rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:border-indigo-300">
                  <option>Last 7 Days</option>
                  <option>This Month</option>
               </select>
               <ChevronDown className="absolute right-3 top-2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600">
               03 Feb 2026 - 09 Feb 2026
            </div>
         </div>
         
         <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100">
            Remaining Balance: 1184:00 (hh:mm)
         </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-slate-200">
            <tr>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name <span className="inline-block ml-1 text-[8px]">▼</span></th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date <span className="inline-block ml-1 text-[8px]">▼</span></th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Log Description</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Spent Hours <span className="inline-block ml-1 text-[8px]">▼</span></th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Billed Hours <span className="inline-block ml-1 text-[8px]">▼</span></th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {billingRecords.map((record, index) => (
               <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{index + 1}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${record.avatarColor}`}>
                           {record.avatar}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{record.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-indigo-600 font-medium hover:underline cursor-pointer">{record.ticketId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{record.description}</td>
                  <td className="px-6 py-4">
                     <div className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded w-fit border border-slate-200">
                        {record.spent}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="bg-white text-slate-800 text-xs font-bold px-3 py-1 rounded w-fit border border-slate-200">
                        {record.billed}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-green-500 hover:bg-green-50 rounded transition-colors" title="Approve">
                           <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Comment">
                           <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center mt-auto">
         <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Records Per Page</span>
            <select className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none">
               <option>10</option>
            </select>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1">
               <span>←</span> Previous
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-indigo-600 text-white rounded text-xs font-bold shadow-sm">
               1
            </button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500 hover:bg-slate-50 flex items-center gap-1">
               Next <span>→</span>
            </button>
         </div>
      </div>
    </div>
  );
};