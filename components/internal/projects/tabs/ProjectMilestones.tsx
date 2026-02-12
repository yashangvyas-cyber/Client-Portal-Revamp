import React, { useState } from 'react';
import { Project } from '../../../../types';
import { Plus, MessageSquare, Edit2, Trash2, X, Calendar } from 'lucide-react';

interface ProjectMilestonesProps {
  project: Project;
}

export const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data matching the screenshot
  const milestones = [
    {
      id: 1,
      name: 'Milestone 1',
      status: 'Pending',
      estimatedDate: '09/Feb/2026',
      addedBy: 'Super User',
      addedTime: '09/Feb/2026, 07:14 PM',
      modifiedBy: '-'
    }
  ];

  return (
    <div className="relative">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800">Milestones</h3>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
              {milestones.length} Milestone
            </span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
          >
            Add Milestone
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Date <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Added By <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Modified By <span className="inline-block ml-1 text-[8px]">▼</span></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {milestones.map((ms, index) => (
                <tr key={ms.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium text-slate-800">{index + 1}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-800">{ms.name}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200 inline-block">
                      {ms.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-medium">{ms.estimatedDate}</td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-bold text-slate-700">{ms.addedBy}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{ms.addedTime}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">{ms.modifiedBy}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
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

      {/* Add Milestone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-slate-800">Add Milestone</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="p-6 space-y-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                       Milestone Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      defaultValue="Miletstone 1"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                          Status <span className="text-red-500">*</span>
                       </label>
                       <div className="relative">
                          <select className="w-full px-4 py-2.5 bg-rose-500/90 text-white border border-rose-600 rounded-lg text-sm font-medium focus:outline-none appearance-none cursor-pointer hover:bg-rose-600 transition-colors">
                             <option className="bg-white text-slate-800">Pending</option>
                             <option className="bg-white text-slate-800">In Progress</option>
                             <option className="bg-white text-slate-800">Completed</option>
                          </select>
                          <div className="absolute right-3 top-3 pointer-events-none text-white/80">
                             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                          Estimated Date
                       </label>
                       <div className="relative">
                          <input 
                            type="text" 
                            defaultValue="09 Feb, 2026"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                          />
                          <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                       Comments
                    </label>
                    <textarea 
                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all h-28 resize-none"
                       placeholder="Enter comments..."
                       defaultValue="Test 1234"
                    ></textarea>
                 </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                   className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                 >
                    Submit
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};