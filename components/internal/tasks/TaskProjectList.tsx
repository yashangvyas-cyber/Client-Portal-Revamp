import React from 'react';
import { Project, ProjectType } from '../../../types';
import { Search, Filter, Star, Eye, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

interface TaskProjectListProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
}

export const TaskProjectList: React.FC<TaskProjectListProps> = ({ projects, onSelectProject }) => {
  
  // Helper to match screenshot data styling
  const getProjectMeta = (project: Project) => {
    // Mocking specific data to match screenshot visuals for demo purposes
    if (project.name.includes('Enterprise')) {
      return { code: '#ALPHA', role: 'Project Manager (PM)', createdBy: 'Super User', date: '05/Feb/2026, 01:55 PM' };
    } else if (project.name.includes('Fixed Cost')) {
      return { code: '#ALPHA1', role: '-', createdBy: 'Super User', date: '09/Feb/2026, 04:40 PM' };
    } else if (project.name.includes('Hirebase')) { // Note: 'hirebase' in constants is lowercase in id p1
      return { code: '#ALPHA2', role: 'Business Analyst (BA)', createdBy: 'Super User', date: '09/Feb/2026, 04:42 PM' };
    }
    return { code: '#AGAF', role: '-', createdBy: 'Jethalal Gada', date: '30/Jun/2025, 02:26 PM' };
  };

  const getBadgeStyle = (type: ProjectType) => {
    switch (type) {
      case ProjectType.HOURLY: return 'bg-slate-100 text-slate-600 border-slate-200'; // Bucket usually gray in this table based on screenshot
      case ProjectType.FIXED: return 'bg-slate-100 text-slate-600 border-slate-200';
      case ProjectType.HIRE_BASE: return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">Task Management</h2>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
            1 - {projects.length} of {projects.length} Projects
          </span>
          <div className="flex items-center gap-2 ml-4">
             <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
             <span className="text-xs font-bold text-slate-600">Show my projects only</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">All</button>
            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50">Favorite</button>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button className="p-1 hover:bg-slate-100 rounded"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
            </div>
             <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button className="p-1 hover:bg-slate-100 rounded"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
            </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-200 flex items-center gap-3">
         <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-4 w-4 text-slate-400" />
               <span className="ml-2 text-slate-400">|</span>
               <span className="ml-2 text-xs text-slate-700 font-medium">Alpha</span>
            </div>
            <input type="text" className="block w-full pl-24 pr-10 py-2 sm:text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
               <span className="text-slate-400 hover:text-slate-600">×</span>
            </div>
         </div>
         <button className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-100 transition-colors">
            Filter
         </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-16">No.</th>
              <th className="px-6 py-4">Project Name <span className="inline-block ml-1 text-[8px]">▼</span></th>
              <th className="px-6 py-4">Type <span className="inline-block ml-1 text-[8px]">▼</span></th>
              <th className="px-6 py-4">Role <span className="inline-block ml-1 text-[8px]">▼</span></th>
              <th className="px-6 py-4">Status <span className="inline-block ml-1 text-[8px]">▼</span></th>
              <th className="px-6 py-4">Created by <span className="inline-block ml-1 text-[8px]">▼</span></th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {projects.map((project, index) => {
               const meta = getProjectMeta(project);
               return (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectProject(project.id)}>
                    <td className="px-6 py-5 text-sm font-bold text-slate-800">{index + 1}</td>
                    <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                            <Star className="w-4 h-4 text-slate-300 mt-0.5" />
                            <div>
                                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">{project.name}</div>
                                <div className="text-[11px] font-bold text-slate-500 mt-0.5">{meta.code}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border bg-slate-100 border-slate-200 text-slate-600`}>
                            {project.type === ProjectType.HOURLY ? 'Bucket' : project.type === ProjectType.FIXED ? 'Fixed Cost' : 'Hire Base'}
                        </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-600 font-medium">
                        {meta.role}
                    </td>
                    <td className="px-6 py-5">
                        <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                            Not Started
                        </span>
                    </td>
                    <td className="px-6 py-5">
                        <div className="text-xs font-bold text-slate-700">{meta.createdBy}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{meta.date}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                            <Eye className="w-4 h-4" />
                        </button>
                    </td>
                </tr>
               );
            })}
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
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1" disabled>
               <ChevronLeft className="w-3 h-3" /> Previous
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-indigo-600 text-white rounded text-xs font-bold shadow-sm">
               1
            </button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500 hover:bg-slate-50 flex items-center gap-1">
               Next <ChevronRight className="w-3 h-3" />
            </button>
         </div>
      </div>
    </div>
  );
};