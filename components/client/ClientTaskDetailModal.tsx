
import React, { useState } from 'react';
import { Task, TaskStatus, User } from '../../types';
import { X, CheckCircle2, MessageSquare, Paperclip, Send, Calendar, Clock, ShieldCheck, AlertCircle, ChevronRight, Check, Ban } from 'lucide-react';
import { USERS } from '../../constants';

interface ClientTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onApprove: (taskId: string) => void;
  onReject: (taskId: string) => void;
}

export const ClientTaskDetailModal: React.FC<ClientTaskDetailModalProps> = ({ isOpen, onClose, task, onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'discussion'>('details');
  
  // Mock Acceptance Criteria
  const acceptanceCriteria = [
      { id: 1, text: 'Feature functions as per specifications.', completed: true },
      { id: 2, text: 'UI matches the provided design mockups.', completed: true },
      { id: 3, text: 'Passes all critical regression tests.', completed: false },
  ];

  // Mock Conversation
  const [comments, setComments] = useState([
      { id: 1, user: 'Harvey Spector', text: 'We have deployed the changes to the staging server. Please review.', time: 'Yesterday, 2:00 PM', isInternal: false },
      { id: 2, user: 'Adrian Andersomn', text: 'Looks good, checking the mobile view now.', time: 'Yesterday, 2:30 PM', isInternal: false }
  ]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
      if (!comment.trim()) return;
      setComments([...comments, {
          id: Date.now(),
          user: USERS.adrian.name,
          text: comment,
          time: 'Just now',
          isInternal: false
      }]);
      setComment('');
  };

  const isReadyForReview = task.status === TaskStatus.REVIEW;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{task.id}</span>
                 {isReadyForReview && (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-amber-200 animate-pulse">
                        Action Required
                    </span>
                 )}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{task.title}</h2>
           </div>
           <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 border-r border-slate-100">
               {/* Status Banner for Review */}
               {isReadyForReview && (
                   <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8 flex flex-col items-center text-center">
                       <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 text-amber-600">
                           <ShieldCheck className="w-6 h-6" />
                       </div>
                       <h3 className="text-lg font-bold text-slate-800 mb-1">Ready for Acceptance</h3>
                       <p className="text-sm text-slate-600 mb-6 max-w-md">
                           The team has marked this task as complete. Please review the deliverables against the criteria below.
                       </p>
                       <div className="flex gap-4 w-full max-w-sm">
                           <button 
                                onClick={() => { onReject(task.id); onClose(); }}
                                className="flex-1 py-2.5 bg-white border border-amber-200 text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                            >
                               <Ban className="w-4 h-4" /> Request Changes
                           </button>
                           <button 
                                onClick={() => { onApprove(task.id); onClose(); }}
                                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-colors flex items-center justify-center gap-2"
                            >
                               <Check className="w-4 h-4" /> Approve
                           </button>
                       </div>
                   </div>
               )}

               <div className="space-y-8">
                   <div>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Description</h3>
                       <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                           {task.description}
                       </div>
                   </div>

                   <div>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Acceptance Criteria</h3>
                       <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                           {acceptanceCriteria.map((criteria, idx) => (
                               <div key={criteria.id} className="flex items-start gap-3 p-4 border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
                                   <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${criteria.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                                       {criteria.completed && <Check className="w-3.5 h-3.5" />}
                                   </div>
                                   <span className={`text-sm ${criteria.completed ? 'text-slate-700' : 'text-slate-500'}`}>{criteria.text}</span>
                               </div>
                           ))}
                       </div>
                   </div>

                   <div>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Deliverables</h3>
                       <div className="flex gap-3">
                           <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all">
                               <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                   <Paperclip className="w-5 h-5" />
                               </div>
                               <div>
                                   <div className="text-xs font-bold text-slate-700">Final_Design.pdf</div>
                                   <div className="text-[10px] text-slate-400">2.4 MB • 10 Feb</div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>

            {/* Sidebar / Chat */}
            <div className="w-[350px] bg-slate-50 flex flex-col">
                {/* Meta Info */}
                <div className="p-6 border-b border-slate-200 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Priority</span>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {task.priority}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Due Date</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {task.dueDate}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Hours Billed</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {task.timeLogs.billable} Hours
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Assigned To</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                            {/* Sanitized Team View */}
                            {task.team && task.team.some(m => !m.isGhost) ? 'Harvey S. & Team' : 'Development Team'}
                        </div>
                    </div>
                </div>

                {/* Discussion */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 bg-white border-b border-slate-200">
                        <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" /> Discussion Thread
                        </h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {comments.map(c => (
                            <div key={c.id} className="flex flex-col gap-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-slate-700">{c.user}</span>
                                    <span className="text-[10px] text-slate-400">{c.time}</span>
                                </div>
                                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none text-xs text-slate-600 shadow-sm">
                                    {c.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Input */}
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                placeholder="Message the project manager..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
