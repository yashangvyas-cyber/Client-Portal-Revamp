import React from 'react';
import { Project, ViewMode, TaskStatus } from '../types';
import { FolderKanban, CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  viewMode: ViewMode;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, viewMode, onClick }) => {
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const totalTasks = tasks.length;
  const progress = project.progress || 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block py-1 px-2 rounded bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2 border border-slate-100">
             {project.clientName || 'Internal'}
          </span>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{project.name}</h3>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
          project.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          {project.status}
        </div>
      </div>

      <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed flex-1">{project.description}</p>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4 text-slate-500">
           <div className="flex items-center gap-1.5 font-medium">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
             <span>{completedTasks}/{totalTasks}</span>
           </div>
           <div className="w-1 h-1 rounded-full bg-slate-300"></div>
           <div className="flex items-center gap-1.5">
             <Clock className="w-4 h-4 text-slate-400" />
             <span>Oct 25</span>
           </div>
        </div>
        
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
           <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};