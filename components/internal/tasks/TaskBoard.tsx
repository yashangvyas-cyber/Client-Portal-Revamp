
import React, { useState } from 'react';
import { Project, ClientRequest, Task, TaskStatus, Priority } from '../../../types';
import { ChevronRight, Star, Filter, Calendar, ChevronDown, Plus, MoreHorizontal, FileText, Bookmark, Info } from 'lucide-react';
import { TaskDetail } from './TaskDetail';
import { CreateIssueModal } from './CreateIssueModal';
import { ProjectTimesheet } from './ProjectTimesheet';
import { ProjectClientRequests } from '../projects/tabs/ProjectClientRequests';
import { useSharedData } from '../../../context/SharedDataContext';

interface TaskBoardProps {
   project: Project;
   onBack: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ project: initialProject, onBack }) => {
   const { projects, addTask, updateClientRequest, currentUser } = useSharedData();

   // Ensure reactivity by finding the project in the shared state
   const project = projects.find(p => p.id === initialProject.id) || initialProject;

   const [activeTab, setActiveTab] = useState('Board');
   const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [createModalInitialData, setCreateModalInitialData] = useState<{ title: string, description: string } | undefined>(undefined);
   const [linkedRequestId, setLinkedRequestId] = useState<string | null>(null);
   const [selectedSprint, setSelectedSprint] = useState('None');

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
      setLinkedRequestId(req.id);
      setIsCreateModalOpen(true);
   };

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false);
      setCreateModalInitialData(undefined);
      setLinkedRequestId(null);
   };

   const handleCreateTask = (data: any) => {
      const newTask: Task = {
         id: `task-${Date.now()}`,
         title: data.title,
         description: data.description,
         status: TaskStatus.TODO,
         priority: Priority.MEDIUM, // Could come from data
         isClientVisible: true,
         timeLogs: { internal: 0, billable: 0 },
         dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
         team: [{ user: currentUser, isGhost: false }],
         projectId: project.id
      };

      addTask(project.id, newTask);

      if (linkedRequestId) {
         updateClientRequest(project.id, linkedRequestId, {
            status: 'Converted to Task',
            taskId: newTask.id
         });
      }

      handleCloseCreateModal();
   };

   const renderTabContent = () => {
      if (activeTab === 'Team Utilization') {
         return <ProjectTimesheet project={project} />;
      }

      if (activeTab === 'Client Requests') {
         return <ProjectClientRequests project={project} onRequestConvert={handleRequestConvert} />;
      }

      // Issue List View
      if (activeTab === 'Issue List') {
         return (
            <div className="flex-1 overflow-auto p-6">
               <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                     <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                           <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                           <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Title</th>
                           <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                           <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Priority</th>
                           <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Assignee</th>
                           <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Due Date</th>
                           <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {project.tasks && project.tasks.length > 0 ? (
                           project.tasks.map((task) => (
                              <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                       <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                          {task.id}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-4 py-3">
                                    <div className="text-sm font-medium text-slate-800">{task.title}</div>
                                 </td>
                                 <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${task.status === 'TODO' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                          task.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                             task.status === 'IN_REVIEW' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                task.status === 'QA' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                   'bg-slate-100 text-slate-700 border border-slate-200'
                                       }`}>
                                       {task.status === 'TODO' ? 'To Do' :
                                          task.status === 'IN_PROGRESS' ? 'In Progress' :
                                             task.status === 'IN_REVIEW' ? 'In Review' :
                                                task.status === 'QA' ? 'Ready For QA' :
                                                   'Done'}
                                    </span>
                                 </td>
                                 <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                       <div className={`w-2 h-2 rounded-full ${task.priority === Priority.HIGH ? 'bg-red-500' :
                                             task.priority === Priority.MEDIUM ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                          }`}></div>
                                       <span className="text-xs font-medium text-slate-600">
                                          {task.priority === Priority.HIGH ? 'High' :
                                             task.priority === Priority.MEDIUM ? 'Medium' :
                                                'Low'}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-4 py-3">
                                    <div className="flex -space-x-1">
                                       {(task.team || []).map((member, i) => (
                                          <div
                                             key={i}
                                             className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm"
                                             title={member.user.name}
                                          >
                                             {member.user.name.substring(0, 2).toUpperCase()}
                                          </div>
                                       ))}
                                       {(!task.team || task.team.length === 0) && (
                                          <span className="text-xs text-slate-400">Unassigned</span>
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-4 py-3">
                                    <span className="text-xs text-slate-600">{task.dueDate || 'No due date'}</span>
                                 </td>
                                 <td className="px-4 py-3">
                                    <button
                                       onClick={() => setSelectedTaskId(task.id)}
                                       className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                    >
                                       View
                                    </button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                                 No tasks found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         );
      }

      // Default Board View
      const columns = [
         { title: 'To Do', count: project.tasks?.filter(t => t.status === 'TODO').length || 0, color: 'bg-blue-600', status: 'TODO' },
         { title: 'In Progress', count: project.tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0, color: 'bg-orange-500', status: 'IN_PROGRESS' },
         { title: 'In Review', count: project.tasks?.filter(t => t.status === 'IN_REVIEW').length || 0, color: 'bg-red-500', status: 'IN_REVIEW' },
         { title: 'Ready For QA', count: project.tasks?.filter(t => t.status === 'QA').length || 0, color: 'bg-green-500', status: 'QA' },
         { title: 'Closed', count: project.tasks?.filter(t => t.status === 'DONE').length || 0, color: 'bg-slate-500', status: 'DONE' }
      ];

      const renderCard = (task: Task) => (
         <div
            key={task.id}
            onClick={() => setSelectedTaskId(task.id)}
            className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm mb-3 hover:shadow-md transition-shadow cursor-pointer group"
         >
            <div className="flex justify-between items-start mb-2">
               <div className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug">{task.title}</div>
               <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-2 mb-3">
               <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <FileText className="w-3 h-3" />
                  <span>0/0</span>
               </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
               <div className="flex -space-x-1.5">
                  {(task.team || []).map((member, i) => (
                     <div key={i} className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-bold border border-white">
                        {member.user.name.substring(0, 2).toUpperCase()}
                     </div>
                  ))}
               </div>

               <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-0.5 rounded-full ${task.priority === Priority.HIGH ? 'bg-red-400' : task.priority === Priority.MEDIUM ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
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
                     {/* Avatar placeholder */}
                  </div>
                  <div className="h-6 w-[1px] bg-slate-200"></div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-slate-500">Sprint:</span>
                     <div className="relative group/sprint">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 transition-all min-w-[100px] justify-between">
                           {selectedSprint} <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                        {/* Sprint Dropdown */}
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
                           </div>
                        </div>

                        <div className="bg-slate-100/50 rounded-xl p-2 flex-1 flex flex-col border border-slate-200/60 transition-colors hover:bg-slate-100/80">
                           {project.tasks?.filter(t => t.status === (col.status as any)).map(renderCard)}

                           {/* Empty State */}
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
               </div>
            </div>
         </>
      );
   }

   return (
      <div className="flex flex-col h-full bg-[#f8f9fc]">
         <CreateIssueModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onSubmit={handleCreateTask}
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
