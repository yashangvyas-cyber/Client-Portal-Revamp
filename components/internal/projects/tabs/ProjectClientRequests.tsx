
import React, { useState } from 'react';
import { Project, ClientRequest, RequestComment, Task, TaskStatus, Priority } from '../../../../types';
import { useSharedData } from '../../../../context/SharedDataContext';
import { CreateIssueModal } from '../../tasks/CreateIssueModal';
import { Search, AlertCircle, CheckSquare, MessageSquare, ArrowRight, Ban, Check, RefreshCw, X, ArrowUpRight, ChevronDown, Paperclip, Eye, ExternalLink, Send } from 'lucide-react';

interface ProjectClientRequestsProps {
    project: Project;
    onRequestConvert?: (req: ClientRequest) => void;
}

export const ProjectClientRequests: React.FC<ProjectClientRequestsProps> = ({ project, onRequestConvert }) => {
    const { updateClientRequest, currentUser, addTask } = useSharedData();
    const requests = project.clientRequests || [];
    const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);

    // Helper function for status badge styling
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Converted to Task': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-slate-100 text-slate-500 border-slate-200';
            case 'Acknowledged': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Under Consideration': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Implemented': return 'bg-green-50 text-green-700 border-green-200';
            case 'Not Planned': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'Resolved': return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'Duplicate': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Cannot Reproduce': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    // Triage State
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [selectedNewStatus, setSelectedNewStatus] = useState<ClientRequest['status'] | ''>('');

    // Task Creation Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [requestToConvert, setRequestToConvert] = useState<ClientRequest | null>(null);

    // Get status options based on request type
    const getStatusOptions = (type: ClientRequest['type']): ClientRequest['status'][] => {
        if (type === 'Bug') {
            return ['Resolved', 'Converted to Task', 'Duplicate', 'Cannot Reproduce', 'Rejected'];
        } else if (type === 'Feature') {
            return ['Converted to Task', 'Under Consideration', 'Rejected'];
        } else { // Feedback
            return ['Acknowledged', 'Under Consideration', 'Implemented', 'Not Planned'];
        }
    };

    const handleStatusChange = (reqId: string, newStatus: ClientRequest['status'], reason?: string) => {
        updateClientRequest(project.id, reqId, {
            status: newStatus,
            rejectionReason: reason
        });
    };

    const handleStatusUpdate = () => {
        if (!selectedRequest || !selectedNewStatus) return;

        // Special handling for "Converted to Task"
        if (selectedNewStatus === 'Converted to Task') {
            handleConvertClick(selectedRequest);
        } else if (selectedNewStatus === 'Rejected') {
            // Trigger Rejection Workflow
            setIsRejecting(true);
        } else {
            handleStatusChange(selectedRequest.id, selectedNewStatus);
            setSelectedRequest(null);
            setSelectedNewStatus('');
        }
    };

    const handleConvertClick = (req: ClientRequest) => {
        // Close triage modal
        setSelectedRequest(null);
        setSelectedNewStatus('');

        // Open Task Creation Modal
        setRequestToConvert(req);
        setIsCreateModalOpen(true);

        // Trigger parent handler (if it was doing anything else)
        if (onRequestConvert) onRequestConvert(req);
    };

    const handleTaskCreated = (issueData: any) => {
        if (!requestToConvert) return;

        console.log('ProjectClientRequests: handleTaskCreated called', { issueData, requestToConvert });

        try {
            // 1. Generate Task ID
            const newTaskId = `T-${Math.floor(Math.random() * 10000)}`;

            // 2. Create Task Object
            // Normalize priority (e.g. "Medium" -> "MEDIUM")
            const normalizedPriority = (issueData.priority?.toUpperCase() as Priority) || Priority.MEDIUM;

            const newTask: Task = {
                id: newTaskId,
                title: issueData.title,
                description: issueData.description,
                status: TaskStatus.TODO,
                priority: normalizedPriority,
                isClientVisible: issueData.isClientVisible !== false, // Default to true unless explicitly hidden
                // Create team from assignee if present
                team: issueData.assignee ? [{ user: currentUser, isGhost: false }] : [], // Simplification for prototype
                timeLogs: { internal: 0, billable: 0 },
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                projectId: project.id
            };

            console.log('ProjectClientRequests: Creating Task', newTask);

            // 3. Add to detailed state
            addTask(project.id, newTask);

            // 4. Link to Request using convertedTaskId (preserving original taskId)
            console.log('ProjectClientRequests: Linking Task to Request', requestToConvert.id);
            updateClientRequest(project.id, requestToConvert.id, {
                status: 'Converted to Task',
                convertedTaskId: newTaskId
            });

            // Close modal
            console.log('ProjectClientRequests: Closing Modal');
            setIsCreateModalOpen(false);
            setRequestToConvert(null);
        } catch (error) {
            console.error('ProjectClientRequests: Error creating task or linking request', error);
            alert('Failed to create task. Please check console for details.');
        }
    };

    const handleRejectClick = () => {
        if (!rejectionReason.trim() || !selectedRequest) return;
        handleStatusChange(selectedRequest.id, 'Rejected', rejectionReason);
        setRejectionReason('');
        setIsRejecting(false);
        setSelectedRequest(null);
    };

    const handleAddComment = () => {
        if (!newComment.trim() || !selectedRequest) return;

        // Optimistic update for local UI if needed, but context handles it.
        const comment: RequestComment = {
            id: `rc-${Date.now()}`,
            author: currentUser,
            content: newComment,
            createdAt: new Date().toLocaleString()
        };

        const currentComments = selectedRequest.comments || [];
        updateClientRequest(project.id, selectedRequest.id, {
            comments: [...currentComments, comment]
        });
        setNewComment('');
    };

    const pendingCount = requests.filter(r => r.status === 'Pending').length;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
            {/* Request Triage Modal (View Details) */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedRequest.type === 'Bug' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {selectedRequest.type === 'Bug' ? <AlertCircle className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">Request Details</h3>
                                    <p className="text-[10px] text-slate-500 font-mono">{selectedRequest.id}</p>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedRequest(null); setIsRejecting(false); }} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto flex-1">
                            {!isRejecting ? (
                                <>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Subject</label>
                                        <div className="text-lg font-bold text-slate-900 leading-tight">{selectedRequest.title}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Submitted By</label>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                    {selectedRequest.submittedBy.name.substring(0, 2)}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{selectedRequest.submittedBy.name}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Date</label>
                                            <div className="text-sm font-semibold text-slate-700">{selectedRequest.submittedAt}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedRequest.description}
                                        </div>
                                    </div>

                                    {/* Related Task Section - User-selected task */}
                                    {selectedRequest.taskId && (() => {
                                        const relatedTask = project.tasks?.find(t => t.id === selectedRequest.taskId);
                                        return (
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                                    Related Task <span className="text-[10px] text-slate-400 font-normal">(Selected by client)</span>
                                                </label>
                                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 hover:bg-blue-100 transition-colors cursor-pointer">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                                                        <CheckSquare className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-mono text-blue-600 mb-0.5">
                                                            {selectedRequest.taskId}
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-800">
                                                            {relatedTask ? relatedTask.title : 'Task not found'}
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-blue-600" />
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Converted Task Section - System-generated task */}
                                    {selectedRequest.convertedTaskId && (() => {
                                        const convertedTask = project.tasks?.find(t => t.id === selectedRequest.convertedTaskId);
                                        return (
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                                    Converted Task <span className="text-[10px] text-slate-400 font-normal">(Created from this request)</span>
                                                </label>
                                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 hover:bg-emerald-100 transition-colors cursor-pointer">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                                        <CheckSquare className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-mono text-emerald-600 mb-0.5">
                                                            {selectedRequest.convertedTaskId}
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-800">
                                                            {convertedTask ? convertedTask.title : 'Task not found'}
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {selectedRequest.rejectionReason && (
                                        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                            <label className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1 block">Rejection Reason</label>
                                            <p className="text-sm text-red-700">{selectedRequest.rejectionReason}</p>
                                        </div>
                                    )}

                                    {/* Mock Attachments */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Attachments</label>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">
                                                <Paperclip className="w-3.5 h-3.5" /> screenshot_error.png
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="pt-6 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-slate-400" /> Comments
                                        </h4>

                                        <div className="space-y-4 mb-4">
                                            {selectedRequest.comments?.map(comment => (
                                                <div key={comment.id} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {comment.author.name.substring(0, 2)}
                                                    </div>
                                                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700 flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-xs">{comment.author.name}</span>
                                                            <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                                                        </div>
                                                        {comment.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!selectedRequest.comments || selectedRequest.comments.length === 0) && (
                                                <p className="text-xs text-slate-400 italic">No comments yet.</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                disabled={!newComment.trim()}
                                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-red-900 text-sm">Reject Request</h4>
                                            <p className="text-xs text-red-700 mt-1">Please provide a reason for rejecting this request. This will be visible to the client.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rejection Reason <span className="text-red-500">*</span></label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all h-32 resize-none"
                                            placeholder="e.g., This is already implemented in feature X, or this is out of scope..."
                                            autoFocus
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Current Status:</span>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(selectedRequest.status)}`}>
                                    {selectedRequest.status}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                {!isRejecting ? (
                                    <>
                                        {selectedRequest.status === 'Pending' && (
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Update Status</label>
                                                    <select
                                                        value={selectedNewStatus}
                                                        onChange={(e) => setSelectedNewStatus(e.target.value as ClientRequest['status'])}
                                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                                    >
                                                        <option value="">Select new status...</option>
                                                        {getStatusOptions(selectedRequest.type).map(status => (
                                                            <option key={status} value={status}>{status}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={handleStatusUpdate}
                                                    disabled={!selectedNewStatus}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all mt-6 ${selectedNewStatus
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Update Status
                                                </button>
                                            </div>
                                        )}
                                        {selectedRequest.status !== 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(selectedRequest.id, 'Pending')}
                                                    className="px-4 py-2 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                                >
                                                    Change Status
                                                </button>
                                                <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">
                                                    Close
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsRejecting(false)}
                                            className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleRejectClick}
                                            disabled={!rejectionReason.trim()}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow-md shadow-red-200 transition-all disabled:opacity-50"
                                        >
                                            Confirm Rejection
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Header Toolbar */}
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-800">Client Requests</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pendingCount > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {pendingCount} Pending Review
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="pl-4 pr-10 py-2 w-64 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted By</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Triage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {requests.map((req, index) => (
                            <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-5 text-sm font-medium text-slate-800">{index + 1}</td>
                                <td className="px-6 py-5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${req.type === 'Bug' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {req.type === 'Bug' ? <AlertCircle className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                                    </div>
                                </td>
                                <td className="px-6 py-5 max-w-sm cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                    <div className="font-bold text-sm text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{req.title}</div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{req.description}</p>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${req.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                        req.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}>
                                        {req.priority || 'Normal'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                            {req.submittedBy.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-700">{req.submittedBy.name}</div>
                                            <div className="text-[10px] text-slate-400">{req.submittedAt}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={() => setSelectedRequest(req)}
                                        className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-slate-400 italic">No client requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Task Creation Modal */}
            <CreateIssueModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setRequestToConvert(null);
                }}
                onSubmit={handleTaskCreated}
                initialData={requestToConvert ? {
                    title: requestToConvert.title,
                    description: requestToConvert.description,
                    priority: requestToConvert.priority,
                    type: requestToConvert.type === 'Bug' ? 'Bug' : 'Task'
                } : undefined}
            />
        </div>
    );
};
