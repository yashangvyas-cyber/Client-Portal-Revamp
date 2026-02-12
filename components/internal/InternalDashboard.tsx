import React from 'react';
import { Project, ViewMode } from '../../types';
import { ProjectCard } from '../ProjectCard';
import { Plus } from 'lucide-react';

interface InternalDashboardProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
}

export const InternalDashboard: React.FC<InternalDashboardProps> = ({ projects, onSelectProject }) => {
  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Internal Dashboard</h1>
          <p className="text-slate-500 font-medium">Overview of active projects and team workload.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm shadow-sm hover:bg-slate-50">Filter</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700">Export Report</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            viewMode={ViewMode.INTERNAL}
            onClick={() => onSelectProject(project.id)}
          />
        ))}
        
        <button className="group border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all h-full min-h-[280px] hover:bg-indigo-50/30">
            <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold text-lg">Create New Project</span>
            <span className="text-sm mt-2 opacity-70">Start a fixed or hourly engagement</span>
          </button>
      </div>
    </div>
  );
};