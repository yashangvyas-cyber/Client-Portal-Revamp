import React, { useState } from 'react';
import { Project } from '../../../types';
import {
   ChevronRight, Star, Paperclip, Plus, Link as LinkIcon, CheckSquare,
   ChevronDown, MessageSquare, Clock, History, FileText, X,
   Calendar, User as UserIcon, Tag, MoreHorizontal, ChevronUp, AlertCircle, Info,
   Eye, EyeOff, Ghost
} from 'lucide-react';
import { AddWorkLogModal } from './AddWorkLogModal';
import { USERS } from '../../../constants';

interface TaskDetailProps {
   taskId: string;
   project: Project;
   onBack: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, project, onBack }) => {
   const [isWorkLogModalOpen, setIsWorkLogModalOpen] = useState(false);
   const [activeActivityTab, setActiveActivityTab] = useState('Work Logs');

   // Task State for Visibility Controls
   const [isTaskVisible, setIsTaskVisible] = useState(true);

   // Discussion State
   const [discussions, setDiscussions] = useState([
      {
         id: 1,
         user: 'Super User',
         userInitials: 'SU',
         userColor: 'bg-red-100 text-red-600',
         message: 'We need to ensure the database is configured with SSL enabled for security.',
         timestamp: '10/Feb/2026, 02:30 PM',
         isInternal: false
      },
      {
         id: 2,
         user: 'Kishan (Shadow)',
         userInitials: 'KS',
         userColor: 'bg-slate-200 text-slate-600',
         message: 'Internal note: The client doesn\'t need to know about the backup configuration details.',
         timestamp: '10/Feb/2026, 03:15 PM',
         isInternal: true
      }
   ]);
   const [newComment, setNewComment] = useState('');
   const [isInternalNote, setIsInternalNote] = useState(false);

   // Team Members with Ghost State
   // isProjectGhost: true means the resource is marked as ghost at project level and cannot be made visible
   const [team, setTeam] = useState([
      { id: 'u1', name: 'Harvey Spector', avatar: 'HS', color: 'bg-purple-100 text-purple-600', isGhost: false, isProjectGhost: false },
      { id: 'u4', name: 'Kishan (Shadow)', avatar: 'KS', color: 'bg-slate-200 text-slate-600', isGhost: true, isProjectGhost: true }
   ]);

   // Error state for ghost toggle
   const [ghostError, setGhostError] = useState<string | null>(null);

   // Mock data matching the screenshot for US-002
   const task = {
      id: 'ALPHA-10',
      key: 'US-002',
      title: 'Configure RDS (PostgreSQL)',
      description: 'As a Backend Dev, I want a managed PostgreSQL database instance so that we can store application data reliably with auto-backups.',
      status: 'To Do',
      reporter: 'Super User',
      priority: 'Medium',
      sprint: 'Sprint 2 Test',
      estimate: 'Add Estimation',
      loggedTime: '1d',
      checklists: [
         { id: 1, text: 'Postgres v15+ instance running.', completed: false },
         { id: 2, text: 'Multi-AZ enabled for high availability.', completed: false },
         { id: 3, text: 'Connection string provided to backend team securely.', completed: false }
      ]
   };

   const [workLogs, setWorkLogs] = useState([
      {
         id: 1,
         user: 'Super User',
         userInitials: 'SU',
         time: '1d',
         date: '10 Feb, 2026',
         description: 'Initial setup research',
         timestamp: '10/Feb/2026, 10:41 AM',
         isClientVisible: true
      }
   ]);

   const handleAddLog = (data: { timeSpent: string; date: string; description: string; isClientVisible: boolean }) => {
      const newLog = {
         id: Date.now(),
         user: 'Super User',
         userInitials: 'SU',
         time: data.timeSpent,
         date: new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
         description: data.description,
         timestamp: new Date().toLocaleString(),
         isClientVisible: data.isClientVisible
      };
      setWorkLogs([newLog, ...workLogs]);
      setActiveActivityTab('Work Logs');
   };

   const toggleGhost = (userId: string) => {
      const member = team.find(m => m.id === userId);

      // Check if this is a project-level ghost resource
      if (member?.isProjectGhost && member.isGhost) {
         setGhostError(`Cannot make "${member.name}" visible to client. This resource is marked as ghost at the project level and must remain hidden from clients for all tasks.`);
         setTimeout(() => setGhostError(null), 5000); // Clear error after 5 seconds
         return;
      }

      setTeam(prev => prev.map(m =>
         m.id === userId ? { ...m, isGhost: !m.isGhost } : m
      ));
   };

   const handlePostComment = () => {
      if (!newComment.trim()) return;

      const comment = {
         id: Date.now(),
         user: 'Super User',
         userInitials: 'SU',
         userColor: 'bg-red-100 text-red-600',
         message: newComment,
         timestamp: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
         isInternal: isInternalNote
      };

      setDiscussions([...discussions, comment]);
      setNewComment('');
      setIsInternalNote(false);
   };

   return (
      <div className="flex flex-col h-full bg-white relative">
         <AddWorkLogModal
            isOpen={isWorkLogModalOpen}
            onClose={() => setIsWorkLogModalOpen(false)}
            onSubmit={handleAddLog}
         />

         {/* Top Nav Breadcrumb */}
         <div className="flex items-center gap-2 text-xs text-slate-500 py-2 px-4 border-b border-slate-100 bg-[#f8f9fc]">
            <span className="cursor-pointer hover:text-indigo-600" onClick={onBack}>Tasks</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-slate-700 cursor-pointer" onClick={onBack}>{project.name}</span>
            <ChevronRight className="w-3 h-3" />
            <Star className="w-3.5 h-3.5 ml-1 text-slate-300 hover:text-amber-400 cursor-pointer" />
         </div>

         {/* Secondary Nav / Tabs Mockup (from screenshot) */}
         <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-white text-xs">
            <div className="flex items-center gap-1 text-slate-500 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
               <div className="w-3 h-3 bg-purple-100 text-purple-600 rounded-sm flex items-center justify-center font-bold text-[8px]">⚡</div>
               <span>ALPHA-1</span>
               <ChevronRight className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-t-lg border border-slate-200 border-b-0 relative top-[1px] font-semibold text-slate-700">
               <div className="w-3 h-3 bg-green-100 text-green-700 rounded-sm flex items-center justify-center font-bold text-[8px]">M</div>
               <span>ALPHA-10</span>
               <span className="text-slate-300">|</span>
               <span className="truncate max-w-[150px]">Cloud Infrastructu...</span>
               <button onClick={onBack} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
            </div>
            <button className="p-1 text-slate-400 hover:bg-slate-100 rounded"><ChevronDown className="w-3 h-3" /></button>
         </div>

         <div className="flex flex-1 overflow-hidden">
            {/* LEFT MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto p-8">
               <div className="flex items-start justify-between mb-6">
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900 mb-2">{task.key} {task.title}</h1>
                     <div className="flex items-center gap-3">
                        {/* Task Level Visibility Toggle */}
                        <button
                           onClick={() => setIsTaskVisible(!isTaskVisible)}
                           className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${isTaskVisible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                        >
                           {isTaskVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                           {isTaskVisible ? 'Visible to Client' : 'Internal Only'}
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                        To Do <ChevronDown className="w-3 h-3" />
                     </button>
                     <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                        <MoreHorizontal className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               {/* Toolbar */}
               <div className="flex flex-wrap gap-2 mb-6">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                     <Paperclip className="w-3.5 h-3.5" /> Attach
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                     <Plus className="w-3.5 h-3.5" /> Add Child
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                     <LinkIcon className="w-3.5 h-3.5" /> Link Issue
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                     <CheckSquare className="w-3.5 h-3.5" /> Add Checklist
                  </button>
               </div>

               {/* Description */}
               <div className="mb-8">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Description</h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed">
                     {task.description}
                  </div>
               </div>

               {/* Checklists */}
               <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-800">Checklists</h3>
                        <div className="relative">
                           <select className="appearance-none bg-white border border-slate-200 pl-3 pr-8 py-1 rounded text-xs font-medium text-slate-600 focus:outline-none focus:border-indigo-300">
                              <option>Select Checklist Group</option>
                           </select>
                           <ChevronDown className="absolute right-2 top-1.5 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="relative">
                           <select className="appearance-none bg-white border border-slate-200 pl-3 pr-8 py-1 rounded text-xs font-medium text-slate-600 focus:outline-none focus:border-indigo-300">
                              <option>All items</option>
                           </select>
                           <ChevronDown className="absolute right-2 top-1.5 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                        <button className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-50"><Plus className="w-3 h-3" /></button>
                     </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                     <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <button><ChevronUp className="w-4 h-4 text-slate-400" /></button>
                           <span className="text-xs font-bold text-slate-700">Checklist 1</span>
                           <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">0 of 3 Completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <button className="p-1 text-slate-400 hover:text-indigo-600"><Plus className="w-3.5 h-3.5" /></button>
                           <button className="p-1 text-slate-400 hover:text-indigo-600"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                     <div className="divide-y divide-slate-100 bg-white">
                        {task.checklists.map(item => (
                           <div key={item.id} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 group">
                              <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                              <span className="text-sm text-slate-700">{item.text}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Activity */}
               <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Activity</h3>
                  <div className="flex items-center gap-2 border-b border-slate-200 mb-4">
                     {['Discussion', 'Comments', 'History', 'Checklist History', 'Work Logs'].map(tab => (
                        <button
                           key={tab}
                           onClick={() => setActiveActivityTab(tab)}
                           className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${activeActivityTab === tab
                              ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30'
                              : 'text-slate-500 border-transparent hover:text-slate-700'
                              }`}
                        >
                           {tab === 'Discussion' && <MessageSquare className="w-3 h-3 inline mr-1" />}
                           {tab}
                        </button>
                     ))}
                     <div className="ml-auto flex items-center gap-1 text-xs font-bold text-slate-500 cursor-pointer">
                        Newest First <ChevronDown className="w-3 h-3" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     {/* Discussion Tab */}
                     {activeActivityTab === 'Discussion' && (
                        <>
                           {/* Comment Input */}
                           <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                              <textarea
                                 value={newComment}
                                 onChange={(e) => setNewComment(e.target.value)}
                                 placeholder="Add a comment or internal note..."
                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none"
                                 rows={3}
                              />
                              <div className="flex items-center justify-between">
                                 <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                       type="checkbox"
                                       checked={isInternalNote}
                                       onChange={(e) => setIsInternalNote(e.target.checked)}
                                       className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-amber-600 transition-colors">
                                       <Ghost className="w-3.5 h-3.5" />
                                       Internal Note (Ghost Mode)
                                    </span>
                                 </label>
                                 <button
                                    onClick={handlePostComment}
                                    disabled={!newComment.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                 >
                                    Post Comment
                                 </button>
                              </div>
                              {isInternalNote && (
                                 <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                       <div className="font-bold text-amber-800 mb-1">Internal Note Mode</div>
                                       <div className="text-amber-700">This comment will be marked as internal and hidden from clients in the client portal view.</div>
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* Discussion List */}
                           {discussions.map(discussion => (
                              <div key={discussion.id} className="flex gap-3 animate-fade-in group">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${discussion.userColor}`}>
                                    {discussion.userInitials}
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                       <div className="text-xs text-slate-500">
                                          <span className="font-bold text-slate-800">{discussion.user}</span> commented
                                       </div>

                                       {/* Internal Note Badge */}
                                       {discussion.isInternal && (
                                          <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                             <Ghost className="w-3 h-3" />
                                             Internal Note
                                          </div>
                                       )}
                                    </div>

                                    <div className={`rounded-lg p-3 text-sm mb-1 ${discussion.isInternal
                                       ? 'bg-amber-50 border border-amber-200 text-amber-900'
                                       : 'bg-slate-50 border border-slate-200 text-slate-700'
                                       }`}>
                                       {discussion.message}
                                    </div>

                                    <div className="flex gap-3 text-[10px] text-slate-400 font-medium">
                                       <span>{discussion.timestamp}</span>
                                       <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                                       <button className="hover:text-indigo-600">Edit</button>
                                       <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                                       <button className="hover:text-red-600">Delete</button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </>
                     )}

                     {activeActivityTab === 'Work Logs' && workLogs.map(log => (
                        <div key={log.id} className="flex gap-3 animate-fade-in group">
                           <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 border border-red-200">
                              {log.userInitials}
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <div className="text-xs text-slate-500 mb-1">
                                    <span className="font-bold text-slate-800">{log.user}</span> logged <span className="font-bold text-slate-800">{log.time}</span> for {log.date} <LinkIcon className="w-3 h-3 inline ml-1 text-slate-400" />
                                 </div>

                                 {/* Log Visibility Status */}
                                 <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${log.isClientVisible ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    {log.isClientVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {log.isClientVisible ? 'Public' : 'Internal'}
                                 </div>
                              </div>

                              {log.description && (
                                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 mb-1">
                                    {log.description}
                                 </div>
                              )}
                              <div className="flex gap-3 text-[10px] text-slate-400 font-medium">
                                 <span>{log.timestamp}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                                 <button className="hover:text-indigo-600">Edit</button>
                                 <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                                 <button className="hover:text-red-600">Delete</button>
                              </div>
                           </div>
                        </div>
                     ))}

                     {activeActivityTab !== 'Work Logs' && activeActivityTab !== 'Discussion' && (
                        <div className="text-center py-6 text-slate-400 text-sm italic">
                           No recent activity in {activeActivityTab}
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-[350px] border-l border-slate-200 bg-white overflow-y-auto">
               <div className="p-6 space-y-6">
                  {/* Team / Assignee Section (Updated for Ghost Logic) */}
                  <div>
                     <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-500 font-medium">Assignees / Team</span>
                        <button className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded transition-colors">
                           <Plus className="w-3 h-3" /> Add
                        </button>
                     </div>

                     {/* Ghost Toggle Error Message */}
                     {ghostError && (
                        <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                           <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                 <div className="text-xs font-bold text-red-800 mb-1">Cannot Change Visibility</div>
                                 <div className="text-xs text-red-700">{ghostError}</div>
                              </div>
                           </div>
                        </div>
                     )}

                     <div className="space-y-2">
                        {team.map(member => (
                           <div key={member.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all ${member.isGhost ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200'}`}>
                              <div className={`flex items-center gap-2 ${member.isGhost ? 'opacity-60' : ''}`}>
                                 <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${member.color}`}>
                                    {member.avatar}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700">{member.name}</span>
                                    {member.isGhost && <span className="text-[9px] text-slate-400 uppercase font-bold flex items-center gap-1"><Ghost className="w-3 h-3" /> Hidden from Client</span>}
                                 </div>
                              </div>

                              <div className="flex items-center gap-1">
                                 {/* Ghost Toggle */}
                                 <button
                                    onClick={() => toggleGhost(member.id)}
                                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${member.isGhost ? 'text-slate-400' : 'text-emerald-500'}`}
                                    title={member.isGhost ? "Hidden from Client (Click to reveal)" : "Visible to Client (Click to hide)"}
                                 >
                                    {member.isGhost ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                 </button>
                                 <button className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Reporter */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">Reporter</span>
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">SU</div>
                        <span className="text-sm font-semibold text-slate-700">Super User</span>
                        <button className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                     </div>
                  </div>

                  {/* Issue Type */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">Issue Type</span>
                     <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded -mr-2">
                        <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center text-white text-[9px] font-bold">
                           <AlertCircle className="w-3 h-3 fill-current text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Story</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                     </div>
                  </div>

                  {/* Priority */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">Priority</span>
                     <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded -mr-2">
                        <span className="text-amber-500 text-lg leading-none"> = </span>
                        <span className="text-sm font-semibold text-slate-700">Medium</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                     </div>
                  </div>

                  {/* Sprint */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">Sprint</span>
                     <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded -mr-2">
                        <span className="text-sm font-semibold text-slate-700">{task.sprint}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                     </div>
                  </div>

                  {/* Tag */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">Tag</span>
                     <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded -mr-2">
                        <span className="text-sm text-slate-400">Search Tags</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                     </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">Due Date</span>
                     <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded -mr-2">
                        <span className="text-sm text-slate-400">Select Date</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                     </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">Estimated Time</span>
                     <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded -mr-2">
                        <span className="text-sm text-slate-400">{task.estimate}</span>
                        <Info className="w-3.5 h-3.5 text-slate-300" />
                     </div>
                  </div>

                  {/* Time Tracking */}
                  <div
                     className="group relative cursor-pointer"
                     onClick={() => setIsWorkLogModalOpen(true)}
                  >
                     <span className="text-xs text-slate-500 font-medium block mb-2 group-hover:text-indigo-600 transition-colors">Time Tracking</span>

                     {/* Tooltip */}
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg shadow-lg pointer-events-none z-10">
                        Tap to log your working hours
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                     </div>

                     <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 group-hover:border-indigo-200 group-hover:bg-indigo-50/10 transition-all">
                        <div className="text-xs text-slate-500 mb-1">Logged Time</div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full mb-2 overflow-hidden">
                           <div className="w-full h-full bg-emerald-500 rounded-full"></div>
                        </div>
                        <div className="font-bold text-sm text-slate-800">1d</div>
                     </div>
                  </div>

                  <div className="border-t border-slate-100 my-4"></div>

                  <div className="space-y-3">
                     <div className="text-xs">
                        <div className="text-slate-400 mb-0.5">Created by</div>
                        <div className="font-bold text-slate-700">Super User</div>
                        <div className="text-slate-400 mt-0.5">05/Feb/2026, 03:55 PM</div>
                     </div>
                     <div className="text-xs">
                        <div className="text-slate-400 mb-0.5">Last Modified by</div>
                        <div className="font-bold text-slate-700">Super User</div>
                        <div className="text-slate-400 mt-0.5">06/Feb/2026, 05:29 PM</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};