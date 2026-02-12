import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import {
    ShieldCheck, ChevronRight, Check, Ban, Layout, ListTodo, History,
    FileText, UserCircle, Tag, ArrowLeft, AlertCircle, Paperclip, Calendar, MessageCircle
} from 'lucide-react';
import { USERS } from '../../constants';

interface ClientTaskDetailViewProps {
    task: Task;
    onClose: () => void;
    onApprove: (taskId: string) => void;
    onReject: (taskId: string) => void;
}

export const ClientTaskDetailView: React.FC<ClientTaskDetailViewProps> = ({ task, onClose, onApprove, onReject }) => {
    const [activeTab, setActiveTab] = useState<'worklogs' | 'discussion'>('worklogs');
    const [newComment, setNewComment] = useState('');

    // Mock Work Logs (Simulating the result of the "Log Review" process)
    // Client sees 'billedHours' and 'publicDescription'. 
    // Internal 'actualHours' and 'internalNotes' are scrubbed before reaching here.
    const workLogs = [
        {
            id: 1,
            user: 'Harvey Spector',
            date: '10 Feb, 2026',
            duration: '4h 30m', // Display string (derived from billedHours)
            billedHours: 4.5,   // What the client pays for
            description: 'Implemented the JWT token logic and storage service.', // Public/Sanitized description
            time: '10:41 AM'
        },
        {
            id: 2,
            user: 'Harvey Spector',
            date: '08 Feb, 2026',
            duration: '2h 00m',
            billedHours: 2.0,
            description: 'Initial setup of the auth module.',
            time: '02:00 PM'
        },
        // Example of a log that might have been "Internal Only" or "0 Billed" - filter these out usually
    ];

    // Mock Data for "JIRA-style" richness
    const acceptanceCriteria = [
        { id: 1, text: 'Feature functions as per specifications.', completed: true },
        { id: 2, text: 'UI matches the provided design mockups.', completed: true },
        { id: 3, text: 'Passes all critical regression tests.', completed: false },
    ];

    const isReadyForReview = task.status === TaskStatus.REVIEW;

    // Time Tracking Calculation
    const estimatedHours = 20;
    const loggedHours = task.timeLogs.billable;
    const progressPercent = Math.min((loggedHours / estimatedHours) * 100, 100);

    return (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col animate-fade-in overflow-hidden font-sans">
            {/* Top Navigation Bar - Compact and Clean */}
            <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex justify-between items-center shadow-sm shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors flex items-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wide">Back</span>
                    </button>
                    <div className="h-5 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100">
                            <Layout className="w-3.5 h-3.5 text-slate-400" />
                            <span>Projects</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-slate-700">{task.id.split('-')[0]}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{task.id}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isReadyForReview && (
                        <div className="flex gap-2 animate-pulse-soft">
                            <button
                                onClick={() => { onReject(task.id); onClose(); }}
                                className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center gap-2"
                            >
                                <Ban className="w-3.5 h-3.5" /> Reject
                            </button>
                            <button
                                onClick={() => { onApprove(task.id); onClose(); }}
                                className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-2"
                            >
                                <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                        </div>
                    )}
                    <div className="h-6 w-px bg-slate-200"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <Paperclip className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content Area - 2 Column Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Task Content */}
                <div className="flex-1 overflow-y-auto px-12 py-10 scrollbar-thin bg-white">
                    <div className="max-w-4xl mx-auto space-y-10">
                        {/* Header Block */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-6">{task.title}</h1>

                            <div className="flex gap-3 mb-6">
                                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                                    <Paperclip className="w-3.5 h-3.5" /> Attach
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                                    <ListTodo className="w-3.5 h-3.5" /> Add Checklist
                                </button>
                            </div>

                            {isReadyForReview && (
                                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-md">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-amber-600" />
                                        <div>
                                            <p className="text-sm font-bold text-amber-900">Ready for QA</p>
                                            <p className="text-xs text-amber-700 mt-0.5">Please review the acceptance criteria below and approve or reject.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="group">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                                Description
                            </h3>
                            <div className="text-slate-800 text-sm leading-7 p-2 -ml-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all whitespace-pre-wrap">
                                {task.description || "No description provided."}
                            </div>
                        </div>

                        {/* Checklists */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    Checklists
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                        {acceptanceCriteria.filter(c => c.completed).length}/{acceptanceCriteria.length} Completed
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {acceptanceCriteria.map((criteria) => (
                                    <div key={criteria.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer group bg-white">
                                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${criteria.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                                            {criteria.completed && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <span className={`text-sm ${criteria.completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{criteria.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Activity Feed - Work Logs & Discussion Tabs */}
                        <div className="pt-8">
                            <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
                                <button
                                    onClick={() => setActiveTab('worklogs')}
                                    className={`pb-3 text-xs font-bold border-b-2 uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'worklogs'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <History className="w-4 h-4" /> Work Logs
                                </button>
                                <button
                                    onClick={() => setActiveTab('discussion')}
                                    className={`pb-3 text-xs font-bold border-b-2 uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'discussion'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <MessageCircle className="w-4 h-4" /> Discussion
                                </button>
                            </div>

                            {/* Work Logs Tab Content */}
                            {activeTab === 'worklogs' && (
                                <div className="space-y-4">
                                    {workLogs.map(log => (
                                        <div key={log.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200">
                                                {log.user.substring(0, 2)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900">{log.user}</span>
                                                        <span className="text-xs text-slate-500">logged</span>
                                                        <span className="text-xs font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">{log.duration}</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {log.date}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed italic">"{log.description}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Discussion Tab Content */}
                            {activeTab === 'discussion' && (
                                <div className="space-y-4">
                                    {/* Mock Discussion Thread */}
                                    <div className="space-y-4">
                                        {/* Comment 1 - Client */}
                                        <div className="flex gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                                                AA
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900">Adrian Anderson</span>
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold uppercase border border-blue-200">Client</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-medium">Feb 10, 2026 • 2:30 PM</div>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">Can we add a password strength indicator to this feature? I think it would improve the user experience significantly.</p>
                                            </div>
                                        </div>

                                        {/* Comment 2 - Project Manager */}
                                        <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 ml-8">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-200">
                                                HS
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900">Harvey Spector</span>
                                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold uppercase border border-purple-200">PM</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-medium">Feb 10, 2026 • 3:15 PM</div>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">Great suggestion! I've added this to the acceptance criteria. The team will implement a visual strength indicator with color coding.</p>
                                            </div>
                                        </div>

                                        {/* Comment 3 - Client */}
                                        <div className="flex gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                                                AA
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900">Adrian Anderson</span>
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold uppercase border border-blue-200">Client</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-medium">Feb 11, 2026 • 10:00 AM</div>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">Perfect! Looking forward to reviewing this once it's ready.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* New Comment Input */}
                                    <div className="pt-4 border-t border-slate-200">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200">
                                                AA
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    rows={3}
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button
                                                        onClick={() => setNewComment('')}
                                                        className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            // In real app, this would save the comment
                                                            setNewComment('');
                                                        }}
                                                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-md hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Post Comment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Right Sidebar - High Density */}
                <div className="w-[340px] bg-slate-50/50 border-l border-slate-200 p-6 overflow-y-auto">
                    <div className="space-y-8">
                        {/* People Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Assignee</label>
                                <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-[9px] font-bold border border-indigo-200">HS</div>
                                    <span className="text-sm font-medium text-slate-700">Harvey Spector</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reporter</label>
                                <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-[9px] font-bold border border-purple-200">SU</div>
                                    <span className="text-sm font-medium text-slate-700">Super User</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${task.priority === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                        {task.priority === 'HIGH' && <AlertCircle className="w-3 h-3" />}
                                        {task.priority}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                        <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'DONE' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sprint</label>
                                    <span className="text-xs font-medium text-slate-700 border-b border-dashed border-slate-300 pb-0.5">Sprint 2 Test</span>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Due Date</label>
                                    <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {task.dueDate || 'No Due Date'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Time Tracking */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Tracking</span>
                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{loggedHours}h logged</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-100">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-medium text-slate-400">
                                <span>{progressPercent.toFixed(0)}%</span>
                                <span>{estimatedHours}h Estimated</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Tags</span>
                            <div className="flex flex-wrap gap-2">
                                {['Frontend', 'React', 'Urgent'].map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-white text-slate-600 rounded text-[10px] font-bold border border-slate-200 hover:border-indigo-300 transition-colors cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
                            <div className="flex justify-between">
                                <span>Created</span>
                                <span>Feb 10, 2026</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Updated</span>
                                <span>Feb 11, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
