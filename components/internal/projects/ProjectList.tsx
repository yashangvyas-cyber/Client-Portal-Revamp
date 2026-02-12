import React, { useState } from 'react';
import { Project, ProjectType, User } from '../../../types';
import { Search, Filter, Plus, Eye, MoreHorizontal, LayoutGrid, List as ListIcon, Star } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject }) => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Not Started': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'In Development': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTypeBadge = (type: ProjectType) => {
    switch (type) {
      case ProjectType.HOURLY: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case ProjectType.FIXED: return 'bg-blue-50 text-blue-700 border-blue-100';
      case ProjectType.HIRE_BASE: return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Projects</h2>
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">{projects.length} Projects</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
            />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
             <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
               <ListIcon className="w-4 h-4" />
             </button>
             <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
               <LayoutGrid className="w-4 h-4" />
             </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-4 overflow-x-auto">
         <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-indigo-300 transition-colors shadow-sm">
            <Filter className="w-3.5 h-3.5" /> Filter
         </button>
         <div className="h-6 w-[1px] bg-slate-300"></div>
         <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
         <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 flex items-center gap-1 shadow-sm">
               Status: Not Signed Off <span className="cursor-pointer hover:text-red-500 ml-1">×</span>
            </span>
            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 flex items-center gap-1 shadow-sm">
               Archived: False <span className="cursor-pointer hover:text-red-500 ml-1">×</span>
            </span>
         </div>
         <button className="ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-700">Clear All</button>
      </div>

      {/* Table View */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-16">No.</th>
              <th className="px-6 py-4 w-24">Code</th>
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Manager</th>
              <th className="px-6 py-4">Deal Owner</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {projects.map((project, index) => (
              <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onSelectProject(project.id)}>
                <td className="px-6 py-4 text-sm text-slate-400 font-medium">{index + 1}</td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase border border-slate-200">
                      {project.id.substring(0,6).toUpperCase()}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer" />
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{project.name}</div>
                        <div className="text-[10px] text-slate-400">{project.clientName || 'Internal Client'}</div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getTypeBadge(project.type)}`}>
                      {project.type.replace('_', ' ')}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(project.status)}`}>
                      {project.status}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[9px] font-bold border border-purple-200">
                        {project.projectManager.name.substring(0,2)}
                      </div>
                      <span className="text-xs font-medium text-slate-700">{project.projectManager.name}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[9px] font-bold border border-orange-200">
                        {project.projectManager.name.substring(0,1)}B
                      </div>
                      <span className="text-xs font-medium text-slate-700">Dhruv B.</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                         <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                         <MoreHorizontal className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
         <span className="text-xs text-slate-500 font-medium">Showing 1-10 of {projects.length} Records</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">Next</button>
         </div>
      </div>
    </div>
  );
};