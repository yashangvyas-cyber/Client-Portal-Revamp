
import React, { useState, useEffect } from 'react';
import { Deal, Project, ProjectType, Invoice, TaskStatus, ClientRequest } from '../types';
import { Eye, ArrowUpRight, MessageSquare, Briefcase, Calendar, CheckCircle2, FileText, Clock, Users, DollarSign, ChevronRight, CheckSquare, PlusCircle, Check, X, AlertCircle, Paperclip, ChevronDown, PieChart, Shield, Image, Search, Download, Star as Start } from 'lucide-react';
import { USERS } from '../constants';
import { ClientTaskDetailView } from './client/ClientTaskDetailView';
import { ClientTimesheet } from './client/ClientTimesheet';
import { ClientTeam } from './client/ClientTeam';
import { HourlyOverview } from './client/overviews/HourlyOverview';
import { FixedOverview } from './client/overviews/FixedOverview';
import { HirebaseOverview } from './client/overviews/HirebaseOverview';

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
   const isSigned = status === 'Signed';
   const isNotSigned = status.includes('Not Signed');

   if (isNotSigned) return <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100 flex items-center gap-1.5 w-fit shadow-sm"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{status}</span>;
   if (isSigned) return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{status}</span>;
   return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 shadow-sm">{status}</span>;
};

const UserAvatar = ({ name, role, size = "w-8 h-8", fontSize = "text-[10px]" }: { name: string, role?: string, size?: string, fontSize?: string }) => (
   <div className="flex items-center gap-3">
      <div className={`${size} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ${fontSize} font-bold text-white shadow-md ring-2 ring-white`}>
         {name.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex flex-col">
         <span className="text-sm font-semibold text-slate-800">{name}</span>
         {role && <span className="text-[11px] font-medium text-slate-400">{role}</span>}
      </div>
   </div>
);

// --- 1. Deals List View ---
interface DealsListProps {
   deals: Deal[];
   onViewDeal: (dealId: string) => void;
}
export const DealsList: React.FC<DealsListProps> = ({ deals, onViewDeal }) => {
   const { projects } = useSharedData();
   return (
      <div className="p-8 max-w-[1600px] mx-auto">
         <div className="flex items-end justify-between mb-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Deals</h2>
               <p className="text-slate-500 text-sm mt-1">Manage and track your active commercial agreements.</p>
            </div>
            <div className="w-72">
               <input type="text" placeholder="Search deals..." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">No.</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Deal Title</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Owner</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Project</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Closing Date</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {deals.map((deal, index) => {
                     const project = projects.find(p => p.id === deal.associatedProjectId);
                     return (
                        <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors group">
                           <td className="px-6 py-5 text-sm text-slate-400 font-medium">{index + 1}</td>
                           <td className="px-6 py-5">
                              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{deal.title}</span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[9px] font-bold">
                                    {deal.owner.name.substring(0, 2).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700">{deal.owner.name}</span>
                                    <span className="text-[10px] text-slate-400">{deal.owner.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              {project ? (
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                    <Briefcase className="w-3 h-3" />
                                    {project.name}
                                 </span>
                              ) : <span className="text-slate-400 text-sm">-</span>}
                           </td>
                           <td className="px-6 py-5 text-sm font-medium text-slate-600">
                              <div className="flex items-center gap-2">
                                 <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                 {deal.closingDate}
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <button onClick={() => onViewDeal(deal.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                 <Eye className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
};

// --- 2. Projects List View (New) ---
interface ProjectsListProps {
   deals: Deal[];
   onViewProject: (projectId: string) => void;
}
export const ProjectsList: React.FC<ProjectsListProps> = ({ deals, onViewProject }) => {
   const { projects } = useSharedData();

   const getProjectTypeLabel = (type: ProjectType) => {
      switch (type) {
         case ProjectType.HIRE_BASE: return { label: 'Hire Base', class: 'bg-purple-50 text-purple-700 border-purple-100' };
         case ProjectType.FIXED: return { label: 'Fixed Cost', class: 'bg-amber-50 text-amber-700 border-amber-100' };
         case ProjectType.HOURLY: return { label: 'Bucket', class: 'bg-blue-50 text-blue-700 border-blue-100' };
         default: return { label: type, class: 'bg-slate-50 text-slate-700' };
      }
   };

   return (
      <div className="p-8 max-w-[1600px] mx-auto">
         <div className="flex items-end justify-between mb-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h2>
               <p className="text-slate-500 text-sm mt-1">Overview of all ongoing projects and their status.</p>
            </div>
            <div className="w-72">
               <input type="text" placeholder="Search projects..." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">No.</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Project Name</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Manager</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Added On</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {projects.map((project, index) => {
                     const typeInfo = getProjectTypeLabel(project.type);
                     const showPM = project.type === ProjectType.HOURLY;

                     return (
                        <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onViewProject(project.id)}>
                           <td className="px-6 py-5 text-sm text-slate-400 font-medium">{index + 1}</td>
                           <td className="px-6 py-5">
                              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{project.name}</span>
                           </td>
                           <td className="px-6 py-5">
                              <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${typeInfo.class} `}>
                                 {typeInfo.label}
                              </span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${project.status === 'Not Started' ? 'bg-slate-300' : 'bg-green-500'} `}></div>
                                 <span className="text-sm text-slate-600 font-medium">{project.status}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              {showPM && project.projectManager ? (
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[9px] font-bold">
                                       {project.projectManager.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-slate-600">{project.projectManager.name}</span>
                                 </div>
                              ) : <span className="text-slate-300">-</span>}
                           </td>
                           <td className="px-6 py-5 text-sm font-medium text-slate-500">{project.addedOn || '-'}</td>
                           <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                 <button onClick={(e) => { e.stopPropagation(); onViewProject(project.id); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                    <Eye className="w-4 h-4" />
                                 </button>
                                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                    <MessageSquare className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
}

// --- 3. Deal Details View ---
interface DealDetailProps {
   deal: Deal;
   project?: Project;
   invoices: Invoice[];
   onViewProject: (projectId: string) => void;
}
export const DealDetail: React.FC<DealDetailProps> = ({ deal, project, invoices, onViewProject }) => {
   return (
      <div className="p-8 max-w-[1200px] mx-auto space-y-8">
         {/* Header Info */}
         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
               <Briefcase className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-start relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border border-indigo-100">Bucket Deal</span>
                     <span className="text-slate-300">|</span>
                     <span className="text-slate-500 text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Closed: {deal.closingDate}</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{deal.title}</h1>

                  <div className="pt-2">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Contacts</span>
                     <div className="flex flex-wrap gap-2">
                        {deal.contacts.map(c => (
                           <div key={c.id} className="bg-white border border-slate-200 pl-1 pr-3 py-1 rounded-full text-slate-700 text-sm flex items-center gap-2 shadow-sm">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-[9px] font-bold">{c.name.substring(0, 2)}</div>
                              {c.name}
                              {c.name.includes('Andersomn') && <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 w-72">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Deal Owner</span>
                  <UserAvatar name={deal.owner.name} role={deal.owner.email} size="w-10 h-10" />
               </div>
            </div>
         </div>

         {/* Projects Section */}
         <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
               Associated Projects
            </h3>

            <div className="bg-white border border-slate-200 rounded-2xl p-1 shadow-sm hover:shadow-md transition-all">
               {project ? (
                  <div className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group" onClick={() => onViewProject(project.id)}>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                           <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{project.name}</div>
                           <div className="flex items-center gap-3 text-sm mt-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-100 border-slate-200 text-slate-600`}>{project.status}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">NDA: {project.ndaSigned ? 'Signed' : 'Not Signed'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="text-right">
                           <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Manager</div>
                           <div className="flex justify-end">
                              {project.projectManager ? (
                                 <UserAvatar name={project.projectManager.name} size="w-6 h-6" fontSize="text-[8px]" />
                              ) : <span className="text-xs text-slate-400">-</span>}
                           </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm">
                           <ArrowUpRight className="w-4 h-4" />
                        </div>
                     </div>
                  </div>
               ) : <p className="p-5 text-sm text-slate-500 italic">No projects linked.</p>}
            </div>
         </div>

         {/* Invoices */}
         <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
               Invoices & Payments
            </h3>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {invoices.map(invoice => (
                        <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-5 text-sm font-bold text-indigo-600">{invoice.invoiceId}</td>
                           <td className="px-6 py-5 text-sm font-medium text-slate-700">{invoice.title}</td>
                           <td className="px-6 py-5 text-sm text-slate-500">{invoice.date}</td>
                           <td className="px-6 py-5 text-sm font-bold text-slate-800">{invoice.currency} {invoice.amount.toLocaleString()}</td>
                           <td className="px-6 py-5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${invoice.status === 'FULLY PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'} `}>
                                 {invoice.status}
                              </span>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 rounded-lg shadow-sm transition-all">
                                 <ArrowUpRight className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}


// --- 4. Project Details View (Dynamic) ---

// ... (Top of file imports)
import { useSharedData } from '../context/SharedDataContext';

// ... (Inside ClientProjectDetail)
export const ClientProjectDetail: React.FC<{ project: Project; deals: Deal[]; onMessageUser: (userId: string) => void }> = ({ project, deals, onMessageUser }) => {
   const { addClientRequest, currentUser } = useSharedData();
   const associatedDeal = deals.find(d => d.id === project.dealId);
   const [activeTab, setActiveTab] = useState<'dashboard' | 'team' | 'work_board' | 'utilization' | 'change_requests'>('dashboard');
   const [workBoardView, setWorkBoardView] = useState<'board' | 'list'>('board');
   const [workBoardFilter, setWorkBoardFilter] = useState<'current_sprint' | 'backlog' | 'past_sprints'>('current_sprint');

   // Request Form State
   const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
   const [newReqTitle, setNewReqTitle] = useState('');
   const [newReqDesc, setNewReqDesc] = useState('');
   const [newReqType, setNewReqType] = useState<'Bug' | 'Feature'>('Bug');
   const [newReqPriority, setNewReqPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
   const [newReqTaskId, setNewReqTaskId] = useState<string>(''); // For Bug Reports to link to a task

   // State for Kanban Tasks (Local override for prototype interactivity)
   const [tasks, setTasks] = useState(project.tasks || []);
   const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<string | null>(null);

   // Sync tasks with project prop updates
   useEffect(() => {
      setTasks(project.tasks || []);
   }, [project.tasks]);

   const handleSubmitRequest = () => {
      if (!newReqTitle.trim() || !newReqDesc.trim()) return;

      const newRequest: ClientRequest = {
         id: `cr-${Date.now()} `,
         title: newReqTitle,
         description: newReqDesc,
         type: newReqType,
         status: 'Pending',
         priority: newReqPriority,
         submittedBy: currentUser, // Use real current user
         submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
         taskId: newReqType === 'Bug' ? newReqTaskId : undefined
      };

      // Call context action
      addClientRequest(project.id, newRequest);

      // Reset & Close
      setNewReqTitle('');
      setNewReqDesc('');
      setNewReqTaskId('');
      setIsRequestModalOpen(false);
   };

   // --- Kanban Logic ---
   const handleApproveTask = (taskId: string) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: TaskStatus.DONE } : t));
   };

   const handleRejectTask = (taskId: string) => {
      // In the modal version, the logic is inside the modal or handled here. 
      // For simplicity, we just revert status.
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: TaskStatus.IN_PROGRESS } : t));
   };

   const kanbanColumns = [
      { id: TaskStatus.TODO, title: 'Up Next', color: 'bg-slate-100 border-slate-200' },
      { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-50 border-blue-100' },
      { id: TaskStatus.REVIEW, title: 'Ready for Review', color: 'bg-amber-50 border-amber-200 ring-4 ring-amber-500/5', isInteractive: true },
      { id: TaskStatus.DONE, title: 'Completed', color: 'bg-emerald-50 border-emerald-100' },
   ];

   const selectedTaskObj = tasks.find(t => t.id === selectedTaskForDetail);

   return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-8 h-full flex flex-col relative">
         {/* Client Task Detail Modal */}
         {/* Client Task Detail View (Full Screen) */}
         {selectedTaskObj && (
            <ClientTaskDetailView
               task={selectedTaskObj}
               onClose={() => setSelectedTaskForDetail(null)}
               onApprove={handleApproveTask}
               onReject={handleRejectTask}
            />
         )}

         {/* Modal for New Request */}
         {isRequestModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                     <h3 className="text-lg font-bold text-slate-800">Submit Request / Report Issue</h3>
                     <button onClick={() => setIsRequestModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="p-6 space-y-5 overflow-y-auto">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Project</label>
                        <input
                           type="text"
                           value={project.name}
                           disabled
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Request Type</label>
                        <div className="flex gap-2">
                           {['Bug', 'Feature', 'Other'].map(type => (
                              <button
                                 key={type}
                                 onClick={() => setNewReqType(type as any)}
                                 className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${newReqType === type ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} `}
                              >
                                 {type === 'Bug' ? 'Bug Report' : type === 'Feature' ? 'Feature Request' : 'Other'}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Subject <span className="text-red-500">*</span></label>
                        <input
                           type="text"
                           value={newReqTitle}
                           onChange={(e) => setNewReqTitle(e.target.value)}
                           className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                           placeholder="Briefly describe the issue or request"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                        <textarea
                           value={newReqDesc}
                           onChange={(e) => setNewReqDesc(e.target.value)}
                           className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all h-32 resize-none"
                           placeholder="Please provide details..."
                        ></textarea>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Priority</label>
                        <div className="relative">
                           <select
                              value={newReqPriority}
                              onChange={(e) => setNewReqPriority(e.target.value as any)}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 appearance-none cursor-pointer"
                           >
                              <option>Low</option>
                              <option>Medium</option>
                              <option>High</option>
                           </select>
                           <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                     </div>

                     {/* Task Selection (Only for Bugs) */}
                     {newReqType === 'Bug' && (
                        <div className="animate-fade-in">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex justify-between">
                              <span>Related Task (Optional)</span>
                              <span className="text-[10px] text-slate-400 font-normal">Link to existing task</span>
                           </label>
                           <div className="relative">
                              <select
                                 className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 appearance-none cursor-pointer"
                                 value={newReqTaskId}
                                 onChange={(e) => setNewReqTaskId(e.target.value)}
                              >
                                 <option value="">-- Select a Task --</option>
                                 {tasks.map(t => (
                                    <option key={t.id} value={t.id}>
                                       {t.title} (ID: {t.id})
                                    </option>
                                 ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                        </div>
                     )}

                     <div>
                        <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-colors">
                           <Paperclip className="w-6 h-6 text-slate-300" />
                           <span className="text-xs font-medium">Attach screenshots or documents</span>
                        </div>
                     </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                     <button
                        onClick={() => setIsRequestModalOpen(false)}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleSubmitRequest}
                        disabled={!newReqTitle || !newReqDesc}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none"
                     >
                        Submit Request
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Top Meta Card */}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 relative overflow-hidden shrink-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="flex flex-col md:flex-row justify-between gap-8">
               <div className="space-y-6 flex-1">
                  <div>
                     <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                           {project.type === ProjectType.HIRE_BASE ? 'Hire Base' : project.type === ProjectType.FIXED ? 'Fixed Cost' : 'Bucket Model'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${project.status === 'Not Started' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-green-100 text-green-700 border-green-200'} `}>
                           {project.status}
                        </span>
                     </div>
                     <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-6 min-w-[300px]">
                  {/* Date Box */}
                  {(project.startDate || project.endDate) && (
                     <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-4 grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start</div>
                           <div className="text-sm font-bold text-slate-800">{project.startDate || '-'}</div>
                        </div>
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End</div>
                           <div className="text-sm font-bold text-slate-800">{project.endDate || '-'}</div>
                        </div>
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sign Off</div>
                           <div className="text-sm font-bold text-slate-800">{project.signOffDate || '-'}</div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* --- TABS --- */}
         <div className="flex gap-1 border-b border-slate-200 shrink-0">
            <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'dashboard' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'} `}>Overview</button>
            <button onClick={() => setActiveTab('team')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'team' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'} `}>Team</button>
            <button onClick={() => setActiveTab('work_board')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'work_board' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'} `}>Project Tasks</button>
            <button onClick={() => setActiveTab('utilization')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'utilization' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'} `}>Utilization</button>
            <button onClick={() => setActiveTab('documents')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'documents' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'} `}>Documents</button>
            <button onClick={() => setActiveTab('change_requests')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'change_requests' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'} `}>My Requests</button>
         </div>

         {/* --- 1. OVERVIEW TAB --- */}
         {activeTab === 'dashboard' && (
            <>
               {project.type === ProjectType.HIRE_BASE && <HirebaseOverview project={project} />}
               {project.type === ProjectType.HOURLY && <HourlyOverview project={project} />}
               {project.type === ProjectType.FIXED && <FixedOverview project={project} />}
            </>
         )}

         {/* --- 2. TEAM TAB --- */}
         {activeTab === 'team' && (
            <ClientTeam project={project} onMessageUser={onMessageUser} />
         )}

         {/* --- 3. PROJECT TASKS TAB --- */}
         {activeTab === 'work_board' && (
            <div className="flex flex-col h-full space-y-4">
               {/* Work Board Controls */}
               <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                           onClick={() => setWorkBoardView('board')}
                           className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${workBoardView === 'board' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                        >
                           Board
                        </button>
                        <button
                           onClick={() => setWorkBoardView('list')}
                           className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${workBoardView === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                        >
                           List
                        </button>
                     </div>
                     <div className="h-6 w-px bg-slate-200"></div>
                     <select
                        value={workBoardFilter}
                        onChange={(e) => setWorkBoardFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                     >
                        <option value="current_sprint">Current Sprint</option>
                        <option value="backlog">Backlog</option>
                        <option value="past_sprints">Past Sprints</option>
                     </select>
                  </div>
               </div>

               {/* Content Area */}
               {workBoardView === 'board' && (
                  <div className="flex-1 overflow-x-auto pb-4">
                     <div className="flex gap-6 min-w-max h-full">
                        {kanbanColumns.map(column => {
                           const columnTasks = tasks.filter(t => t.status === column.id && t.isClientVisible);
                           return (
                              <div key={column.id} className="w-[340px] flex flex-col h-full">
                                 {/* Column Header */}
                                 <div className={`flex items-center justify-between mb-4 px-4 py-3 rounded-xl border ${column.color} `}>
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full ${column.id === TaskStatus.DONE ? 'bg-emerald-500' : column.id === TaskStatus.REVIEW ? 'bg-amber-500' : column.id === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-slate-400'} `}></div>
                                       <h3 className="font-bold text-slate-800 text-sm">{column.title}</h3>
                                    </div>
                                    <span className="bg-white/50 px-2 py-0.5 rounded-md text-xs font-bold text-slate-600">{columnTasks.length}</span>
                                 </div>

                                 {/* Tasks Area */}
                                 <div className="flex-1 space-y-3">
                                    {columnTasks.map(task => (
                                       <div
                                          key={task.id}
                                          onClick={() => setSelectedTaskForDetail(task.id)}
                                          className={`bg-white p-4 rounded-xl border shadow-sm hover: shadow-md transition-all group relative cursor-pointer ${column.isInteractive ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'} `}
                                       >
                                          {/* Header Status/Priority */}
                                          <div className="flex justify-between items-start mb-2">
                                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                                } `}>
                                                {task.priority}
                                             </span>
                                             {task.timeLogs?.billable > 0 && (
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                   {task.timeLogs.billable}h Billed
                                                </span>
                                             )}
                                          </div>

                                          <h4 className="font-bold text-slate-800 mb-1 leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                                          <p className="text-xs text-slate-500 line-clamp-2 mb-4">{task.description}</p>

                                          {/* Approvals Action Area (Visible in Kanban, but also in Modal) */}
                                          {column.isInteractive && (
                                             <div className="mb-4 flex gap-2">
                                                <button
                                                   onClick={(e) => { e.stopPropagation(); handleApproveTask(task.id); }}
                                                   className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                                                >
                                                   <Check className="w-3.5 h-3.5" /> Approve
                                                </button>
                                                <button
                                                   onClick={(e) => { e.stopPropagation(); handleRejectTask(task.id); }}
                                                   className="flex-1 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                                >
                                                   <X className="w-3.5 h-3.5" /> Reject
                                                </button>
                                             </div>
                                          )}

                                          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                             {/* Sanitized Team View */}
                                             <div className="flex -space-x-2">
                                                {task.team?.filter(m => !m.isGhost).map((member, idx) => (
                                                   <img key={idx} src={member.user.avatar || "https://i.pravatar.cc/150"} className="w-6 h-6 rounded-full border border-white shadow-sm" title={member.user.name} />
                                                ))}
                                                {(!task.team || task.team.filter(m => !m.isGhost).length === 0) && (
                                                   <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 border border-slate-200">Team</div>
                                                )}
                                             </div>
                                             <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                                <Calendar className="w-3 h-3" /> {task.dueDate}
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               )}

               {workBoardView === 'list' && (
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex items-center justify-center p-20">
                     <div className="text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <PlusCircle className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold mb-1">Issue List View</h3>
                        <p className="text-slate-500 text-sm">Table view listing all issues in a flat list.</p>
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* --- 4. UTILIZATION TAB --- */}
         {activeTab === 'utilization' && (
            <ClientTimesheet project={project} />
         )}

         {/* --- 5. DOCUMENTS TAB --- */}
         {activeTab === 'documents' && (
            <div className="space-y-8 animate-fade-in">

               {/* Search & Filter (Visual only for now) */}
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h3 className="font-bold text-slate-800 text-xl">Documents & Assets</h3>
                     <p className="text-sm text-slate-500">Access your contracts, invoices, and brand assets.</p>
                  </div>
                  <div className="relative w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input type="text" placeholder="Search files..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" />
                  </div>
               </div>

               {/* UNIFIED DOCUMENTS SECTION */}
               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                     <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800">Project Documents</h4>
                        <p className="text-xs text-slate-500">All shared contracts, invoices, assets, and files</p>
                     </div>
                  </div>

                  {project.documents?.filter(d => d.isClientVisible).length === 0 ? (
                     <div className="p-8 text-center text-slate-400 text-sm italic">No documents shared with you yet.</div>
                  ) : (
                     <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                           <tr>
                              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Document Name</th>
                              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Download</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {project.documents?.filter(d => d.isClientVisible).map(doc => (
                              <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded flex items-center justify-center ${doc.category === 'ASSET_LIBRARY' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'} `}>
                                          {doc.category === 'ASSET_LIBRARY' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                       </div>
                                       <div>
                                          <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{doc.name}</div>
                                          {doc.comments && <div className="text-[10px] text-slate-400 max-w-xs truncate">{doc.comments}</div>}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                                       {doc.type}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-xs font-medium text-slate-500">{doc.uploadedAt}</td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                       <Download className="w-4 h-4" />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </div>
         )}

         {/* --- 6. MY REQUESTS TAB --- */}
         {activeTab === 'change_requests' && (
            <div className="space-y-6 max-w-5xl mx-auto w-full">
               <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div>
                     <h3 className="font-bold text-slate-800">My Requests</h3>
                     <p className="text-xs text-slate-500">Track status of your bug reports and feature requests</p>
                  </div>
                  <button
                     onClick={() => setIsRequestModalOpen(true)}
                     className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-all"
                  >
                     <PlusCircle className="w-5 h-5" /> New Request
                  </button>
               </div>

               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {project.clientRequests && project.clientRequests.length > 0 ? (
                     <div className="divide-y divide-slate-100">
                        {project.clientRequests.map(req => (
                           <div key={req.id} className="p-6 flex gap-4 hover:bg-slate-50 transition-colors group relative">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${req.type === 'Bug' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} `}>
                                 {req.type === 'Bug' ? <AlertCircle className="w-6 h-6" /> : <CheckSquare className="w-6 h-6" />}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-1.5">
                                    <h4 className="font-bold text-slate-800 text-lg">{req.title}</h4>
                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${req.status === 'Converted to Task' ? 'bg-emerald-100 text-emerald-700' : req.status === 'Rejected' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'} `}>
                                       {req.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide border border-slate-200 px-2 py-0.5 rounded-full">{req.priority} Priority</span>
                                 </div>
                                 <p className="text-sm text-slate-600 mb-3 leading-relaxed">{req.description}</p>
                                 <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span>Ref ID: <span className="font-mono text-slate-500">{req.id}</span></span>
                                    <span>Submitted: {req.submittedAt}</span>
                                 </div>
                              </div>
                              <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                    <ArrowUpRight className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                           <Briefcase className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">No requests submitted yet.</p>
                        <button onClick={() => setIsRequestModalOpen(true)} className="mt-4 text-indigo-600 text-sm font-bold hover:underline">Submit your first request</button>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};
