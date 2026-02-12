import React from 'react';
import { Project } from '../../../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ProjectTopUpProps {
  project: Project;
}

export const ProjectTopUp: React.FC<ProjectTopUpProps> = ({ project }) => {
  // Mock Data matching the screenshot
  const topUpHistory = [
    {
      id: 1,
      comment: 'New Top-UP',
      hours: '1,000',
      addedOn: '05/Feb/2026',
      addedBy: 'Super User',
      addedTime: '05/Feb/2026, 02:19 PM',
      modifiedBy: '-'
    },
    {
      id: 2,
      comment: 'Initial top-up',
      hours: '200',
      addedOn: '05/Feb/2026',
      addedBy: 'Super User',
      addedTime: '05/Feb/2026, 01:55 PM',
      modifiedBy: '-'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Initially Bought Hours</div>
          <div className="text-4xl font-extrabold text-slate-900">200</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Top-Up Hours</div>
          <div className="text-4xl font-extrabold text-slate-900">1,000</div>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg transition-colors border border-indigo-100">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Hours</div>
          <div className="text-4xl font-extrabold text-slate-900">1,200</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Billed Hours</div>
          <div className="text-4xl font-extrabold text-slate-900">16:00</div>
        </div>
      </div>

      {/* Top-Up List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800">Top-Up</h3>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
              {topUpHistory.length} Top-Ups
            </span>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm shadow-indigo-200 transition-all">
            Add Top-Up
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Top-Up Hours <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Added On <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Added by <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Modified by <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topUpHistory.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium text-slate-800">{index + 1}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-800">{item.comment}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-800">{item.hours}</td>
                  <td className="px-6 py-5 text-sm text-slate-600">{item.addedOn}</td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-bold text-slate-700">{item.addedBy}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.addedTime}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">{item.modifiedBy}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};