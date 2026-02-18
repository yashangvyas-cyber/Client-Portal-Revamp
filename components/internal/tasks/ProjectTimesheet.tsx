
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
        // Approved entry - client visible and finalized (GREEN BORDER)
        {
            id: 'l1', taskId: 'ALPHA-10', taskTitle: 'Configure RDS', userId: 'u3', userName: 'Super User', userAvatar: 'SU', date: '2026-02-10', hours: 4, billedHours: 4, description: 'Initial setup', isClientVisible: true, isBilled: true, timestamp: '10:00 AM'
        },
        // Internal-only entry - never shown to client (ORANGE DASHED BORDER)
        {
            id: 'l2', taskId: 'ALPHA-10', taskTitle: 'Configure RDS', userId: 'u4', userName: 'Shadow Dev', userAvatar: 'SD', date: '2026-02-10', hours: 4, billedHours: 4, description: 'Backend configs', isClientVisible: false, isBilled: false, timestamp: '02:00 PM'
        },
        // Approved entry (GREEN BORDER)
        {
            id: 'l3', taskId: 'ALPHA-13', taskTitle: 'Containerization', userId: 'u1', userName: 'Harvey Spector', userAvatar: 'HS', date: '2026-02-09', hours: 6, billedHours: 6, description: 'Docker setup', isClientVisible: true, isBilled: true, timestamp: '09:00 AM'
        },
        // PENDING APPROVAL - client-visible but not finalized yet (AMBER BORDER)
        // PM can change billed hours from 6 to 8, then click "Approve & Finalize"
        {
            id: 'l4', taskId: 'ALPHA-12', taskTitle: 'S3 Bucket Config', userId: 'u1', userName: 'Harvey Spector', userAvatar: 'HS', date: '2026-02-11', hours: 6, billedHours: 6, description: 'Permissions & Security Audit', isClientVisible: true, isBilled: false, timestamp: '11:00 AM'
        },
        // Another PENDING entry (AMBER BORDER)
        {
            id: 'l5', taskId: 'ALPHA-14', taskTitle: 'API Integration', userId: 'u3', userName: 'Super User', userAvatar: 'SU', date: '2026-02-11', hours: 4, billedHours: 4, description: 'REST API endpoints', isClientVisible: true, isBilled: false, timestamp: '01:00 PM'
        },
        // Internal-only (ORANGE DASHED BORDER)
        {
            id: 'l6', taskId: 'ALPHA-15', taskTitle: 'Code Review', userId: 'u4', userName: 'Shadow Dev', userAvatar: 'SD', date: '2026-02-11', hours: 2, billedHours: 2, description: 'Internal code review session', isClientVisible: false, isBilled: false, timestamp: '03:00 PM'
        }
    ];
};

export const ProjectTimesheet: React.FC<ProjectTimesheetProps> = ({ project }) => {
    const [viewMode, setViewMode] = useState<'resource' | 'task'>('resource');
    const [logs, setLogs] = useState<WorkLog[]>(generateMockLogs(project));
    const [modalState, setModalState] = useState<{ isOpen: boolean, date: string, entityId: string, title: string } | null>(null);

    // Filters
    const [selectedResource, setSelectedResource] = useState<string>('all');
    const [selectedTask, setSelectedTask] = useState<string>('all');

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

    // Apply filters
    const filteredLogs = logs.filter(log => {
        const matchesResource = selectedResource === 'all' || log.userId === selectedResource;
        const matchesTask = selectedTask === 'all' || log.taskId === selectedTask;
        return matchesResource && matchesTask;
    });

    const getCellData = (dateStr: string, entityId: string) => {
        const field = viewMode === 'resource' ? 'userId' : 'taskId';
        const cellLogs = filteredLogs.filter(l => l.date === dateStr && l[field] === entityId);

        // Calculate totals: internal hours vs billed hours
        const totalHours = cellLogs.reduce((acc, curr) => acc + curr.hours, 0);

        // Only count billed hours for logs that are CLIENT VISIBLE
        const totalBilled = cellLogs.reduce((acc, curr) => {
            if (!curr.isClientVisible) return acc;
            return acc + (curr.billedHours ?? curr.hours);
        }, 0);

        return { totalHours, totalBilled, logs: cellLogs };
    };

    // Get unique resources and tasks for filter dropdowns
    const allResources = Array.from(new Set(logs.map(l => l.userId))).map(uid => {
        const log = logs.find(l => l.userId === uid);
        return { id: uid, name: log?.userName || 'Unknown' };
    });

    const allTasks = Array.from(new Set(logs.map(l => l.taskId))).map(tid => {
        const log = logs.find(l => l.taskId === tid);
        return { id: tid, name: `${tid} - ${log?.taskTitle}` };
    });

    // Grouping (using filtered logs)
    const rows: { id: string; title: string; avatar?: string }[] = viewMode === 'resource'
        ? Array.from(new Set(filteredLogs.map(l => l.userId))).map((uid: any) => {
            const log = filteredLogs.find(l => l.userId === uid);
            return { id: uid as string, title: log?.userName || 'Unknown', avatar: log?.userAvatar };
        })
        : Array.from(new Set(filteredLogs.map(l => l.taskId))).map((tid: any) => {
            const log = filteredLogs.find(l => l.taskId === tid);
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
                    <h2 className="text-lg font-bold text-slate-800">Timesheet Reports</h2>
                    <div className="h-6 w-[1px] bg-slate-200"></div>

                    {/* View Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('resource')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'resource' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Resources
                        </button>
                        <button
                            onClick={() => setViewMode('task')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'task' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Task
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400">
                        <option>Last 7 Days</option>
                        <option>Last 14 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                        <option>Last Month</option>
                    </select>

                    {/* Resource Filter */}
                    <select
                        value={selectedResource}
                        onChange={(e) => setSelectedResource(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                    >
                        <option value="all">All Resources</option>
                        {allResources.map(resource => (
                            <option key={resource.id} value={resource.id}>{resource.name}</option>
                        ))}
                    </select>

                    {/* Task Filter */}
                    <select
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                    >
                        <option value="all">All Tasks</option>
                        {allTasks.map(task => (
                            <option key={task.id} value={task.id}>{task.name}</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-sm">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-xs font-medium text-slate-700 min-w-[140px] text-center flex items-center justify-center gap-2">
                            10 Feb 2026 - 16 Feb 2026
                        </span>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight className="w-4 h-4" /></button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all">
                        <Download className="w-3.5 h-3.5" /> Search
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-6 text-xs">
                <span className="font-semibold text-slate-600">Borders:</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
                    <span className="text-slate-600">Client Visible</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 border-2 border-amber-500 rounded"></div>
                    <span className="text-slate-600">Pending Approval</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 border-2 border-dashed border-orange-400 rounded"></div>
                    <span className="text-slate-600">Internal Only</span>
                </div>
            </div>

            {/* Matrix */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden min-w-[1000px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[50px_150px_1fr] border-b border-slate-200 bg-slate-50">
                        <div className="p-3 text-xs font-medium text-slate-600 text-center border-r border-slate-200">
                            No.
                        </div>
                        <div className="p-3 text-xs font-medium text-slate-600 border-r border-slate-200">
                            Date
                        </div>
                        <div className="grid grid-cols-7 divide-x divide-slate-200">
                            {dates.map((date, i) => (
                                <div key={i} className="p-3 text-center">
                                    <div className="text-xs font-medium text-slate-700">
                                        {date.toLocaleDateString('en-US', { day: '2-digit' })} {date.toLocaleDateString('en-US', { month: 'short' })} {date.getFullYear()}
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-100">
                        {/* Total Row */}
                        <div className="grid grid-cols-[50px_150px_1fr] bg-green-50 font-bold border-b-2 border-green-200">
                            <div className="p-3 border-r border-slate-200 flex items-center justify-center">
                                <span className="text-xs text-slate-600"></span>
                            </div>
                            <div className="p-3 border-r border-slate-200 flex items-center gap-2">
                                <div className="text-sm font-bold text-slate-800">Total</div>
                            </div>
                            <div className="grid grid-cols-7 divide-x divide-slate-100">
                                {dates.map((date, i) => {
                                    const dateStr = formatDate(date);
                                    const dailyTotal = logs.filter(l => l.date === dateStr).reduce((acc, curr) => acc + curr.hours, 0);
                                    return (
                                        <div key={i} className="p-3 flex items-center justify-center">
                                            <span className="text-xs font-bold text-slate-800">
                                                {dailyTotal > 0 ? dailyTotal.toFixed(2) : '00:00'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Staff Rows */}
                        {rows.map((row, rowIndex) => {
                            return (
                                <div key={row.id} className="grid grid-cols-[50px_150px_1fr] hover:bg-slate-50 transition-colors">
                                    <div className="p-3 border-r border-slate-200 flex items-center justify-center">
                                        <span className="text-xs text-slate-600">{rowIndex + 1}</span>
                                    </div>
                                    <div className="p-3 border-r border-slate-200 flex items-center gap-2">
                                        <div className="text-sm font-medium text-slate-700">{row.title}</div>
                                    </div>
                                    <div className="grid grid-cols-7 divide-x divide-slate-100">
                                        {dates.map((date, i) => {
                                            const dateStr = formatDate(date);
                                            const { totalHours, totalBilled, logs: cellLogs } = getCellData(dateStr, row.id);
                                            const hasDiscrepancy = totalHours !== totalBilled;

                                            // Check visibility and finalization status
                                            const hasClientVisibleFinalized = cellLogs.some(log => log.isClientVisible && log.isBilled);
                                            const hasClientVisiblePending = cellLogs.some(log => log.isClientVisible && !log.isBilled);
                                            const hasInternalOnly = cellLogs.some(log => !log.isClientVisible);

                                            // Determine border style based on visibility and approval status
                                            let borderStyle = '';
                                            if (hasClientVisibleFinalized && hasClientVisiblePending) {
                                                borderStyle = 'border-2 border-blue-400'; // Mixed: some finalized, some pending
                                            } else if (hasClientVisibleFinalized) {
                                                borderStyle = 'border-2 border-green-500'; // Client can see (finalized)
                                            } else if (hasClientVisiblePending) {
                                                borderStyle = 'border-2 border-amber-500'; // Pending approval (not visible to client yet)
                                            } else if (hasInternalOnly) {
                                                borderStyle = 'border-2 border-dashed border-orange-400'; // Internal only
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    className="relative p-2 cursor-pointer hover:bg-indigo-50/30 transition-colors flex items-center justify-center"
                                                    onClick={() => totalHours > 0 && handleCellClick(dateStr, row.id, row.title)}
                                                >
                                                    {totalHours > 0 ? (
                                                        <div className={`
                                                        px-2.5 py-1.5 rounded text-xs font-bold
                                                        ${totalHours >= 8
                                                                ? 'text-green-700 font-extrabold'
                                                                : totalHours >= 4
                                                                    ? 'text-slate-700'
                                                                    : 'text-slate-500'}
                                                        bg-white
                                                        ${borderStyle}
                                                    `}>
                                                            {hasDiscrepancy ? (
                                                                <div className="flex flex-col items-center">
                                                                    <span className="text-[11px]">{totalHours.toFixed(2)}</span>
                                                                    <span className="text-[9px] opacity-60">/ {totalBilled.toFixed(2)}</span>
                                                                </div>
                                                            ) : (
                                                                <span>{totalHours.toFixed(2)}</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 text-sm">-</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
