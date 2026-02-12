
import React, { useState } from 'react';
import { Project, ProjectType } from '../../../types';
import { ChevronLeft, Star, Edit, ChevronRight, PenLine } from 'lucide-react';
import { ProjectOverview } from './tabs/ProjectOverview';
import { ProjectResources } from './tabs/ProjectResources';
import { ProjectTopUp } from './tabs/ProjectTopUp';
import { ProjectTimesheet } from '../tasks/ProjectTimesheet';
import { ProjectBilling } from './tabs/ProjectBilling';
import { ProjectMilestones } from './tabs/ProjectMilestones';
import { PlaceholderTab } from './tabs/PlaceholderTab';
import { ProjectDocuments } from './tabs/ProjectDocuments';

interface ProjectDetailsWrapperProps {
   project: Project;
   onBack: () => void;
}

import { useSharedData } from '../../../context/SharedDataContext';

export const ProjectDetailsWrapper: React.FC<ProjectDetailsWrapperProps> = ({ project: projectProp, onBack }) => {
   const { projects } = useSharedData();

   // CRITICAL FIX: Use useMemo to derive the fresh project from context
   // This ensures React properly tracks the dependency and re-renders when projects change (e.g. adding documents)
   const project = React.useMemo(() => {
      const freshProject = projects.find(p => p.id === projectProp.id);
      return freshProject || projectProp;
   }, [projects, projectProp.id, projectProp]);

   const [activeTab, setActiveTab] = useState('Details');

   // Define Tabs based on Project Type
   const getTabs = (type: ProjectType) => {
      const common = ['Details', 'Documents', 'Resources'];
      const logs = ['Notes', 'History', 'Project Logs'];

      switch (type) {
         case ProjectType.HOURLY:
            return [...common, 'Top-Up', ...logs, 'Billing'];
         case ProjectType.FIXED:
            return [common[0], 'Milestones', 'Documents', 'Resources', 'Change Requests', ...logs];
         case ProjectType.HIRE_BASE:
            return [...common, ...logs];
         default:
            return common;
      }
   };

   const tabs = getTabs(project.type);

   // -- Render Tab Content --
   const renderTabContent = () => {
      switch (activeTab) {
         case 'Details': return <ProjectOverview project={project} />;
         case 'Resources': return <ProjectResources project={project} />;
         case 'Top-Up': return <ProjectTopUp project={project} />;
         case 'Project Logs': return <ProjectTimesheet project={project} />;
         case 'Billing': return <ProjectBilling project={project} />;
         case 'Milestones': return <ProjectMilestones project={project} />;
         case 'Documents': return <ProjectDocuments project={project} />;
         default: return <PlaceholderTab title={activeTab} />;
      }
   };

   return (
      <div className="flex flex-col h-full bg-[#f8f9fc]">
         {/* Top Breadcrumb Nav */}
         <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 px-2">
            <span className="cursor-pointer hover:text-indigo-600" onClick={onBack}>Projects</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-indigo-600">Details</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-slate-700">{project.name}</span>
            <Star className="w-3.5 h-3.5 ml-2 text-slate-300 hover:text-amber-400 cursor-pointer" />
         </div>

         {/* Main Layout: Sidebar + Content */}
         <div className="flex flex-1 gap-6 overflow-hidden">
            {/* LEFT SIDEBAR (Meta Info) */}
            <div className="w-72 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit overflow-y-auto shrink-0">
               <div className="mb-6">
                  <div className="text-lg font-bold text-slate-900 leading-tight mb-2">{project.name}</div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 mb-3">
                     {project.id.toUpperCase().substring(0, 8)}
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-center border ${project.status === 'Not Started' ? 'bg-purple-600 text-white border-purple-700' : 'bg-emerald-600 text-white border-emerald-700'}`}>
                     {project.status}
                  </div>
               </div>

               <div className="space-y-5">
                  <div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deal</div>
                     <div className="font-semibold text-sm text-indigo-600 hover:underline cursor-pointer truncate" title={project.dealId}>
                        {project.dealId} | {project.name.substring(0, 15)}...
                     </div>
                  </div>

                  <div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deal Owner</div>
                     <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[9px] font-bold">HS</div>
                        <span className="text-sm font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded">Harvey S.</span>
                     </div>
                  </div>

                  <div className="border-t border-slate-100 my-2"></div>

                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500">Project Key</span>
                     <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">ALPHA</span>
                  </div>

                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500">Project Type</span>
                     <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {project.type === ProjectType.HOURLY ? 'Bucket' : project.type === ProjectType.FIXED ? 'Fixed Cost' : 'Hire Base'}
                     </span>
                  </div>

                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500">NDA</span>
                     <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1">
                        Not Signed <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                     </span>
                  </div>

                  <div className="border-t border-slate-100 my-2"></div>

                  {/* Dates */}
                  <div className="space-y-3">
                     {project.type === ProjectType.HOURLY && (
                        <div className="flex justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 uppercase">Est. Hours</span>
                              <span className="text-sm font-bold text-slate-800">2,000</span>
                           </div>
                           <div className="h-8 w-[1px] bg-slate-100"></div>
                           <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-400 uppercase">Balance</span>
                              <span className="text-sm font-bold text-emerald-600">1184:00</span>
                           </div>
                        </div>
                     )}

                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Start Date</span>
                        <span className="font-medium text-slate-800">{project.startDate || '10/Feb/2026'}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">End Date</span>
                        <span className="font-medium text-slate-800">{project.endDate || '10/Aug/2026'}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Sign-Off Date</span>
                        <span className="font-medium text-slate-800">-</span>
                     </div>
                  </div>

                  <div className="border-t border-slate-100 my-2"></div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <div className="text-[10px] text-slate-400 mb-1">Created By</div>
                     <div className="text-xs font-bold text-slate-700">Super User</div>
                     <div className="text-[10px] text-slate-400 mt-0.5">05/Feb/2026, 01:55 PM</div>
                  </div>
               </div>
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
               {/* Navigation Tabs */}
               <div className="bg-white border border-slate-200 rounded-t-2xl px-2 shadow-sm mb-4 flex items-center justify-between">
                  <div className="flex items-center overflow-x-auto no-scrollbar">
                     {tabs.map(tab => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`relative px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab
                              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10'
                              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                              }`}
                        >
                           {tab}
                        </button>
                     ))}
                  </div>
                  <div className="flex items-center gap-2 px-4 border-l border-slate-100 pl-4 py-2">
                     <button className="text-xs font-semibold text-indigo-600 hover:underline mr-3">View Task Board</button>
                     <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow hover:bg-indigo-700 transition-all">Edit</button>
                  </div>
               </div>

               {/* Tab Content */}
               <div className="flex-1 overflow-y-auto pb-10">
                  {renderTabContent()}
               </div>
            </div>
         </div>
      </div>
   );
};
