
import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Ghost, ArrowRight, Save, RotateCcw, Lock, AlertCircle, MessageSquare, CheckCircle, Ban } from 'lucide-react';
import { WorkLog } from '../../../types';
import { USERS } from '../../../constants';

interface TimesheetLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: string;
    title: string; // Resource Name or Task Title
    logs: WorkLog[];
    onUpdateLog: (logId: string, updates: Partial<WorkLog>) => void;
}

export const TimesheetLogModal: React.FC<TimesheetLogModalProps> = ({ isOpen, onClose, date, title, logs, onUpdateLog }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Log Review
                            <span className="text-slate-300">|</span>
                            <span className="text-indigo-600">{date}</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Reviewing logs for: <span className="text-slate-700 font-bold">{title}</span></p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List of Logs */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {logs.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 italic">No logs found for this selection.</div>
                    ) : (
                        logs.map(log => (
                            <LogItem
                                key={log.id}
                                log={log}
                                onUpdate={(updates) => onUpdateLog(log.id, updates)}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-between items-center">
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        <span>Override controls visible only to Managers.</span>
                    </div>
                    <button onClick={onClose} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition-all">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

const LogItem: React.FC<{
    log: WorkLog;
    onUpdate: (updates: Partial<WorkLog>) => void;
}> = ({ log, onUpdate }) => {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState(log.internalComment || '');
    // Determines the current billed hours (defaults to actual hours if undefined)
    const currentBilledHours = log.billedHours ?? log.hours;
    const isHoursModified = currentBilledHours !== log.hours;

    const toggleVisibility = () => {
        onUpdate({ isClientVisible: !log.isClientVisible });
    };

    const handleBilledHoursChange = (val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 0) {
            onUpdate({ billedHours: num });
        }
    };

    const resetBilledHours = () => {
        onUpdate({ billedHours: undefined }); // Reset to match actual hours
    };

    return (
        <div className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${!log.isClientVisible ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold ${!log.isClientVisible ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {log.userAvatar || log.userName.substring(0, 2)}
                        </div>
                        {/* Ghost Indicator */}
                        {log.userName.includes('Shadow') && (
                            <div className="absolute -bottom-1 -right-1 bg-slate-800 text-white p-[2px] rounded-full border border-white" title="Ghost Resource">
                                <Ghost className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${!log.isClientVisible ? 'text-slate-500' : 'text-slate-800'}`}>{log.userName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{log.taskId}</span>
                            <span className="text-slate-400">|</span>
                            <span>{log.taskTitle}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Hours Control Section */}
                    {/* Hours Control Section */}
                    <div className="flex items-center gap-6 mr-2">
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Spent</div>
                            <div className="text-sm font-bold text-slate-700">{log.hours.toFixed(2)}h</div>
                        </div>

                        {/* Only show Billed Hours if Client Visible */}
                        {log.isClientVisible ? (
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="text-[9px] uppercase font-bold text-indigo-600 tracking-wider">Billed</div>
                                <div className="relative group/input">
                                    <input
                                        type="number"
                                        className={`w-14 px-1 py-0.5 text-center text-sm font-bold border-b-2 border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:outline-none transition-all ${isHoursModified ? 'text-amber-700 border-amber-400 focus:border-amber-500' : 'text-slate-800'}`}
                                        value={currentBilledHours}
                                        onChange={(e) => handleBilledHoursChange(e.target.value)}
                                        step="0.25"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-0.5 opacity-50">
                                <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Billed</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                    <Ban className="w-3 h-3" />
                                    <span>N/A</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>

                    <button
                        onClick={toggleVisibility}
                        className={`p-2 rounded-lg border transition-all flex items-center justify-center min-w-[36px] ${log.isClientVisible ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'}`}
                        title={log.isClientVisible ? "Visible to Client" : "Internal Only"}
                    >
                        {log.isClientVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Action Buttons */}
                    <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>

                    <button
                        onClick={() => {
                            setCommentText(log.internalComment || '');
                            setIsEditingComment(!isEditingComment);
                        }}
                        className={`p-2 rounded-lg border transition-all ${log.internalComment || isEditingComment ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100' : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'}`}
                        title={log.internalComment ? "Edit Internal Comment" : "Add Internal Comment"}
                    >
                        <MessageSquare className="w-4 h-4" />
                    </button>

                    {!log.isBilled ? (
                        <button
                            onClick={() => onUpdate({ isBilled: true })}
                            className="p-2 rounded-lg border border-slate-200 hover:border-green-200 hover:bg-green-50 text-slate-400 hover:text-green-600 transition-all font-bold"
                            title="Bill / Approve"
                        >
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200" title="Billed">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                    )}


                </div>
            </div>

            <div className={`text-xs mb-1 p-2.5 rounded border ${!log.isClientVisible ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-50 text-slate-600 border-slate-100 italic'}`}>
                "{log.description}"
            </div>

            {isEditingComment ? (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in">
                    <textarea
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none bg-white text-slate-700"
                        rows={3}
                        placeholder="Add internal rationale for this log..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => setIsEditingComment(false)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onUpdate({ internalComment: commentText });
                                setIsEditingComment(false);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors flex items-center gap-1"
                        >
                            <Save className="w-3 h-3" />
                            Save Note
                        </button>
                    </div>
                </div>
            ) : (
                log.internalComment && (
                    <div className="flex items-start gap-2 mt-2 p-2 bg-indigo-50/50 border border-indigo-100 rounded text-xs text-indigo-800">
                        <MessageSquare className="w-3 h-3 mt-0.5 shrink-0 opacity-70" />
                        <div>
                            <span className="font-bold uppercase text-[10px] opacity-70 block mb-0.5">Internal Note:</span>
                            {log.internalComment}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
