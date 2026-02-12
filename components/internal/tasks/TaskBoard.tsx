
import React, { useState } from 'react';
import { Project, ClientRequest } from '../../../types';
import { ChevronRight, Star, Filter, Calendar, ChevronDown, Plus, MoreHorizontal, FileText, Bookmark, Info } from 'lucide-react';
import { TaskDetail } from './TaskDetail';
import { CreateIssueModal } from './CreateIssueModal';
import { ProjectTimesheet } from './ProjectTimesheet';
import { ProjectClientRequests } from '../projects/tabs/ProjectClientRequests';

interface TaskBoardProps {
  project: Project;
  onBack: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState('Board');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialData, setCreateModalInitialData] = useState<{title: string, description: string} | undefined>(undefined);

  // If a task is selected, show the detail view
  if (selectedTaskId) {
     return (
        <TaskDetail 
           taskId={selectedTaskId} 
           project={project} 
           onBack={() => setSelectedTaskId(null)} 
        />
     );
  }

  const handleRequestConvert = (req: ClientRequest) => {
      setCreateModalInitialData({
          title: req.title,
          description: req.description
      });
      setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false);
      setCreateModalInitialData(undefined); // Reset
  };

  const renderTabContent = () => {
      if (activeTab === 'Team Utilization') {
          return <ProjectTimesheet project={project} />;
      }
      
      if (activeTab === 'Client Requests') {
          return <ProjectClientRequests project={project} onRequestConvert={handleRequestConvert} />;
      }

      // Default Board View
      const columns = [
        { title: 'To Do', count: 2, color: 'bg-blue-600' },
        { title: 'In Progress', count: 3, color: 'bg-orange-500' },
        { title: 'In Review', count: 0, color: 'bg-red-500' },
        { title: 'Ready For QA', count: 0, color: 'bg-green-500' },
        { title: 'Closed', count: 0, color: 'bg-slate-500' }
      ];

      // Mock Data for "In Progress" column based on screenshot
      const inProgressTasks = [
        { id: 'ALPHA-13', title: 'Containerization (Docker)', type: 'US', subtasks: '0/3', priority: 'Medium' },
        { id: 'ALPHA-12', title: 'S3 Bucket Configuration', type: 'US', subtasks: '0/3', priority: 'High' },
        { id: 'ALPHA-11', title: 'CI/CD Pipeline Setup', type: 'US', subtasks: '0/4', priority: 'Medium' }
      ];

      // Mock Data for "To Do" column
      const toDoTasks = [
        { id: 'ALPHA-10', title: 'US-002 Configure RDS (PostgreSQL)', type: 'US', subtasks: '0/3', priority: 'High' },
        { id: 'ALPHA-9', title: 'Setup AWS VPC & Networking', type: 'US', subtasks: '0/3', priority: 'High' }
      ];

      const renderCard = (task: any) => (
        <div 
          key={task.id} 
          onClick={() => setSelectedTaskId(task.id)}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm mb-3 hover:shadow-md transition-shadow cursor-pointer group"
        >
           <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug">{task.title}</div>
              {task.id === 'ALPHA-9' && (
                  <button className="text-slate-400 hover:text-slate-600" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="w-4 h-4" /></button>
              )}
           </div>
           
           <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                 <FileText className="w-3 h-3" />
                 <span>{task.subtasks}</span>
              </div>
           </div>

           <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-bold border border-white">HS</div>
                  {task.id.includes('13') && (
                     <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[9px] font-bold border border-white">SU</div>
                  )}
              </div>
              
              <div className="flex items-center gap-1.5">
                 <div className="w-3 h-0.5 bg-yellow-400 rounded-full"></div>
                 <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 border border-green-100 rounded text-[9px] font-bold text-green-700">
                    <Bookmark className="w-2.5 h-2.5 fill-green-700" />
                    {task.id}
                 </div>
              </div>
           </div>
        </div>
      );

      return (
          <>
             {/* Controls Header (Only show for Board) */}
             <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-200">
                <div className="flex items-center gap-4">
                   <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded">
                      <Filter className="w-4 h-4" />
                   </button>
                   <div className="flex -space-x-1">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold border-2 border-white">SU</div>
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">HS</div>
                      <button className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors z-10">
                         <span className="text-xs">+</span>
                      </button>
                   </div>
                   <div className="h-6 w-[1px] bg-slate-200"></div>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Sprint:</span>
                      <div className="relative">
                         <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300">
                            None <ChevronDown className="w-3 h-3 text-slate-400" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Group by:</span>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300">
                         <Calendar className="w-3 h-3 text-slate-400" /> None <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>
                   </div>
                   
                   <button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                   >
                      Create <ChevronDown className="w-3 h-3 ml-1" />
                   </button>
                   
                   <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
                   </div>
                </div>
             </div>

             {/* Kanban Board */}
             <div className="flex-1 overflow-x-auto p-4">
                 <div className="flex gap-4 min-w-max h-full">
                    {columns.map(col => (
                       <div key={col.title} className="w-[280px] flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3 px-1">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                                <h3 className="text-xs font-bold text-slate-700">{col.title}</h3>
                                <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{col.count}</span>
                             </div>
                             <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                                 <button className="text-slate-400 hover:text-slate-600"><Plus className="w-3.5 h-3.5" /></button>
                                 <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                             </div>
                          </div>
                          
                          <div className="bg-slate-100/50 rounded-xl p-2 flex-1 flex flex-col border border-slate-200/60">
                             {col.title === 'To Do' && toDoTasks.map(renderCard)}
                             {col.title === 'In Progress' && inProgressTasks.map(renderCard)}
                             
                             {/* Empty State visual aid if column empty */}
                             {col.count === 0 && (
                                <div className="h-full flex items-center justify-center">
                                   <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 text-xs">
                                      Empty
                                   </div>
                                </div>
                             )}
                          </div>
                       </div>
                    ))}
                    
                     {/* Add Column Button */}
                     <div className="w-[50px] pt-1">
                        <button className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors border border-indigo-200">
                           <Plus className="w-5 h-5" />
                        </button>
                     </div>
                 </div>
             </div>
             
             {/* Help Icon (Bottom Right from screenshot) */}
             <button className="fixed bottom-6 right-6 w-10 h-10 bg-amber-100 text-amber-500 border border-amber-200 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Info className="w-5 h-5" />
             </button>
          </>
      );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc]">
      <CreateIssueModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal}
        initialData={createModalInitialData}
      />

      {/* Top Nav Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 px-2 pt-2">
         <span className="cursor-pointer hover:text-indigo-600" onClick={onBack}>Tasks</span>
         <ChevronRight className="w-3 h-3" />
         <span className="font-bold text-slate-700">{project.name}</span>
         <Star className="w-3.5 h-3.5 ml-1 text-slate-300 hover:text-amber-400 cursor-pointer" />
      </div>

      {/* Tabs Header */}
      <div className="bg-white border-b border-slate-200">
         <div className="flex items-center gap-6 px-4 pt-2 overflow-x-auto">
            {['Board', 'Issue List', 'Client Requests', 'Backlog', 'Completed Sprints', 'Team Utilization', 'Notification Settings'].map(tab => (
               <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
               >
                  {tab}
                  {tab === 'Client Requests' && (project.clientRequests?.filter(r => r.status === 'Pending').length || 0) > 0 && (
                      <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{project.clientRequests?.filter(r => r.status === 'Pending').length}</span>
                  )}
               </button>
            ))}
         </div>
      </div>
      
      {/* Dynamic Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
          {renderTabContent()}
      </div>
    </div>
  );
};
