
import React, { useState } from 'react';
import { Project, WorkLog } from '../../../types';
import { ChevronLeft, ChevronRight, Calendar, User, CheckSquare, Filter, Download } from 'lucide-react';
import { TimesheetLogModal } from './TimesheetLogModal';

interface ProjectTimesheetProps {
    project: Project;
}

// Generate dates for the view
const getDaysArray = () => {
    const dates = [];
    const start = new Date('2026-02-09'); // Monday
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d);
    }
    return dates;
};

// Mock Data Generator
const generateMockLogs = (project: Project): WorkLog[] => {
    return [
        {
            id: 'l1', taskId: 'ALPHA-10', taskTitle: 'Configure RDS', userId: 'u3', userName: 'Super User', userAvatar: 'SU', date: '2026-02-10', hours: 4, billedHours: 4, description: 'Initial setup', isClientVisible: true, timestamp: '10:00 AM'
        },
        {
            id: 'l2', taskId: 'ALPHA-10', taskTitle: 'Configure RDS', userId: 'u4', userName: 'Shadow Dev', userAvatar: 'SD', date: '2026-02-10', hours: 4, billedHours: 4, description: 'Backend configs', isClientVisible: false, timestamp: '02:00 PM'
        },
        {
            id: 'l3', taskId: 'ALPHA-13', taskTitle: 'Containerization', userId: 'u1', userName: 'Harvey Spector', userAvatar: 'HS', date: '2026-02-09', hours: 6, billedHours: 6, description: 'Docker setup', isClientVisible: true, timestamp: '09:00 AM'
        },
        // Example of a pre-modified log where hours were topped up (6 -> 8)
        {
            id: 'l4', taskId: 'ALPHA-12', taskTitle: 'S3 Bucket Config', userId: 'u1', userName: 'Harvey Spector', userAvatar: 'HS', date: '2026-02-11', hours: 6, billedHours: 8, description: 'Permissions & Security Audit', isClientVisible: true, timestamp: '11:00 AM'
        }
    ];
};

export const ProjectTimesheet: React.FC<ProjectTimesheetProps> = ({ project }) => {
    const [viewMode, setViewMode] = useState<'resource' | 'task'>('resource');
    const [logs, setLogs] = useState<WorkLog[]>(generateMockLogs(project));
    const [modalState, setModalState] = useState<{ isOpen: boolean, date: string, entityId: string, title: string } | null>(null);

    const dates = getDaysArray();

    // Handlers
    const handleCellClick = (dateStr: string, entityId: string, title: string) => {
        setModalState({
            isOpen: true,
            date: dateStr,
            entityId,
            title
        });
    };

    const handleUpdateLog = (logId: string, updates: Partial<WorkLog>) => {
        setLogs(prev => prev.map(log => log.id === logId ? { ...log, ...updates } : log));
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const getCellData = (dateStr: string, entityId: string) => {
        const field = viewMode === 'resource' ? 'userId' : 'taskId';
        const cellLogs = logs.filter(l => l.date === dateStr && l[field] === entityId);

        // Calculate totals: internal hours vs billed hours
        const totalHours = cellLogs.reduce((acc, curr) => acc + curr.hours, 0);
        const totalBilled = cellLogs.reduce((acc, curr) => acc + (curr.billedHours ?? curr.hours), 0);

        return { totalHours, totalBilled, logs: cellLogs };
    };

    // Grouping
    const rows: { id: string; title: string; avatar?: string }[] = viewMode === 'resource'
        ? Array.from(new Set(logs.map(l => l.userId))).map((uid: any) => {
            const log = logs.find(l => l.userId === uid);
            return { id: uid as string, title: log?.userName || 'Unknown', avatar: log?.userAvatar };
        })
        : Array.from(new Set(logs.map(l => l.taskId))).map((tid: any) => {
            const log = logs.find(l => l.taskId === tid);
            return { id: tid as string, title: `${tid} ${log?.taskTitle}`, avatar: undefined };
        });

    return (
        <div className="flex flex-col h-full bg-[#f8f9fc] animate-fade-in">
            {/* Drill Down Modal */}
            {modalState && (
                <TimesheetLogModal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState(null)}
                    date={modalState.date}
                    title={modalState.title}
                    logs={getCellData(modalState.date, modalState.entityId).logs}
                    onUpdateLog={handleUpdateLog}
                />
            )}

            {/* Toolbar */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('resource')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'resource' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <User className="w-3.5 h-3.5" /> By Resource
                        </button>
                        <button
                            onClick={() => setViewMode('task')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'task' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <CheckSquare className="w-3.5 h-3.5" /> By Task
                        </button>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-200"></div>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-sm">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-xs font-bold text-slate-700 min-w-[140px] text-center flex items-center justify-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 09 Feb - 15 Feb
                        </span>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
                        <Filter className="w-3.5 h-3.5" /> Filters
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                </div>
            </div>

            {/* Matrix */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-w-[1000px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[250px_1fr] border-b border-slate-200 bg-slate-50">
                        <div className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 flex items-center">
                            {viewMode === 'resource' ? 'Team Member' : 'Task'}
                        </div>
                        <div className="grid grid-cols-7 divide-x divide-slate-200">
                            {dates.map((date, i) => (
                                <div key={i} className="p-3 text-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div className={`text-sm font-bold ${date.toISOString().split('T')[0] === '2026-02-10' ? 'text-indigo-600' : 'text-slate-700'}`}>
                                        {date.getDate()} {date.toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-100">
                        {rows.map(row => (
                            <div key={row.id} className="grid grid-cols-[250px_1fr] hover:bg-slate-50 transition-colors group">
                                <div className="p-4 border-r border-slate-200 flex items-center gap-3">
                                    {viewMode === 'resource' && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                            {row.avatar}
                                        </div>
                                    )}
                                    {viewMode === 'task' && (
                                        <div className="w-8 h-8 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
                                            <CheckSquare className="w-4 h-4" />
                                        </div>
                                    )}
                                    <div className="text-sm font-bold text-slate-700 truncate">{row.title}</div>
                                </div>
                                <div className="grid grid-cols-7 divide-x divide-slate-100">
                                    {dates.map((date, i) => {
                                        const dateStr = formatDate(date);
                                        const { totalHours, totalBilled } = getCellData(dateStr, row.id);
                                        const isDiscrepancy = totalHours !== totalBilled;

                                        return (
                                            <div
                                                key={i}
                                                className="relative p-2 cursor-pointer hover:bg-indigo-50/50 transition-colors flex items-center justify-center"
                                                onClick={() => totalHours > 0 && handleCellClick(dateStr, row.id, row.title)}
                                            >
                                                {totalHours > 0 ? (
                                                    <div className={`
                                                    px-3 py-1.5 rounded-md text-xs font-bold border shadow-sm transition-transform hover:scale-105 flex flex-col items-center min-w-[60px]
                                                    ${totalHours >= 8
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-white text-slate-700 border-slate-200'}
                                                `}>
                                                        <span className="text-sm">{totalHours.toFixed(1)}h</span>

                                                        {isDiscrepancy && (
                                                            <div className={`
                                                            text-[9px] px-1.5 py-0.5 rounded-full mt-1 w-full text-center border flex items-center justify-center gap-0.5
                                                            ${totalBilled > totalHours
                                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'  // Profit (Billed > Actual)
                                                                    : 'bg-amber-100 text-amber-700 border-amber-200'}       // Leak (Billed < Actual)
                                                        `}>
                                                                {totalBilled > totalHours ? '+' : ''}
                                                                {(totalBilled - totalHours).toFixed(1)}h
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-200 text-xl font-light">-</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Totals Row */}
                        <div className="grid grid-cols-[250px_1fr] bg-slate-50/50 font-bold border-t border-slate-200">
                            <div className="p-4 border-r border-slate-200 text-right text-xs text-slate-500 uppercase tracking-wider">
                                Daily Totals
                            </div>
                            <div className="grid grid-cols-7 divide-x divide-slate-200">
                                {dates.map((date, i) => {
                                    const dateStr = formatDate(date);
                                    const dailyTotal = logs.filter(l => l.date === dateStr).reduce((acc, curr) => acc + curr.hours, 0);
                                    return (
                                        <div key={i} className="p-3 text-center text-sm text-slate-800">
                                            {dailyTotal > 0 ? `${dailyTotal.toFixed(2)}h` : '-'}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
