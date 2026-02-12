import React, { useState, useMemo, useEffect } from 'react';
import { Project, WorkLog } from '../../types';
import { Calendar, Filter, Download, ChevronDown, ChevronRight, Clock, Users, Briefcase, FileText, Search, LayoutGrid, List, CheckCircle2, PieChart, TrendingUp, AlignJustify, AlignLeft, CheckSquare, Shield } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext'; // NEW IMPORT

interface ClientTimesheetProps {
   project: Project;
}

// ... (imports)

interface ClientTimesheetProps {
   project: Project;
}

// ... (imports)

// Restored Types
type DateRange = 'this_week' | 'last_week' | 'this_month' | 'last_month';
type GroupMode = 'date' | 'task' | 'resource';
type Density = 'comfortable' | 'compact';

// Helper to aggregate logs (KEEP THIS)
const aggregateLogs = (logs: WorkLog[]): WorkLog[] => {
   // ... (existing aggregation logic)
   const map = new Map<string, WorkLog & { count: number, descriptions: string[] }>();

   logs.forEach(log => {
      // Key based on User + Task + Date
      const key = `${log.date}-${log.userId}-${log.taskId}`;

      if (!map.has(key)) {
         map.set(key, { ...log, count: 1, descriptions: [log.description] });
      } else {
         const entry = map.get(key)!;
         entry.hours += log.hours;
         if (entry.billedHours && log.billedHours) entry.billedHours += log.billedHours;
         entry.count += 1;
         if (!entry.descriptions.includes(log.description)) {
            entry.descriptions.push(log.description);
         }
      }
   });

   return Array.from(map.values()).map(entry => ({
      ...entry,
      description: entry.descriptions.join(' • '),
      _count: entry.count
   } as any));
};

export const ClientTimesheet: React.FC<ClientTimesheetProps> = ({ project }) => {
   const { logs } = useSharedData();

   // Filter logs for this project. 
   // In a real app backend does this. Here we filter by task id match or deal association.
   // Simplest for prototype: Filter logs where taskId belongs to a task in this project.
   const projectTaskIds = useMemo(() => project.tasks?.map(t => t.id) || [], [project]);

   const allLogs = useMemo(() => {
      console.log('=== TOTAL LOGS IN SYSTEM ===', logs.length);
      console.log('=== PROJECT TASK IDS ===', projectTaskIds);
      console.log('=== SAMPLE LOG TASK IDS ===', logs.slice(0, 5).map(l => l.taskId));

      // Filter by project task IDs
      const filtered = logs.filter(l => {
         const matches = projectTaskIds.includes(l.taskId) && l.isClientVisible;
         return matches;
      });

      console.log('=== FILTERED LOGS FOR THIS PROJECT ===', filtered.length);
      return filtered;
   }, [logs, projectTaskIds]);

   const [dateRange, setDateRange] = useState<DateRange>('this_month');

   const [viewMode, setViewMode] = useState<GroupMode>('date');
   const [density, setDensity] = useState<Density>('comfortable');
   const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
   const [showAllForDay, setShowAllForDay] = useState<Record<string, boolean>>({}); // Track "Show More" state

   // Auto-switch logic
   useEffect(() => {
      if (project.type === 'HIRE_BASE') {
         setViewMode('resource');
      } else if (dateRange === 'this_month' || dateRange === 'last_month') {
         setViewMode('task');
      } else {
         setViewMode('date');
      }
   }, [dateRange, project.type]);


   const filteredLogs = useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const getStartOfDay = (d: Date) => {
         const newD = new Date(d);
         newD.setHours(0, 0, 0, 0);
         return newD;
      };

      const startOfWeek = getStartOfDay(new Date(today));
      startOfWeek.setDate(today.getDate() - today.getDay());

      const endOfWeek = getStartOfDay(new Date(today));
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

      const startOfLastWeek = getStartOfDay(new Date(startOfWeek));
      startOfLastWeek.setDate(startOfWeek.getDate() - 7);

      const endOfLastWeek = getStartOfDay(new Date(startOfLastWeek));
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      return allLogs.filter(log => {
         if (!log.isClientVisible) return false;
         const logDate = getStartOfDay(new Date(log.date));

         if (dateRange === 'today') return logDate.getTime() === today.getTime();
         if (dateRange === 'this_week') return logDate >= startOfWeek && logDate <= endOfWeek;
         if (dateRange === 'last_week') return logDate >= startOfLastWeek && logDate <= endOfLastWeek;
         if (dateRange === 'this_month') return logDate >= startOfMonth && logDate <= endOfMonth;
         if (dateRange === 'last_month') return logDate >= startOfLastMonth && logDate <= endOfLastMonth;
         if (dateRange === 'all') return true;
         return true;
      });
   }, [allLogs, dateRange]);

   const groupedData = useMemo(() => {
      const groups: Record<string, { totalHours: number, logs: WorkLog[], metadata?: any }> = {};

      // Apply aggregation logic universally to reduce clutter in all views (Date, Resource, Task)
      const logsToProcess = aggregateLogs(filteredLogs);

      logsToProcess.forEach(log => {
         let key = '';
         let meta = {};

         if (viewMode === 'date') {
            key = log.date;
         } else if (viewMode === 'task') {
            key = log.taskId || 'unknown';
            meta = { title: log.taskTitle };
         } else if (viewMode === 'resource') {
            const isGhost = log.userName.includes('Shadow') || log.userId === 'u4';
            key = isGhost ? 'generic-team' : log.userId;
            meta = {
               name: isGhost ? 'Collab Team Member' : log.userName,
               avatar: isGhost ? 'CT' : log.userAvatar,
               isGhost
            };
         }

         if (!groups[key]) {
            groups[key] = { totalHours: 0, logs: [], metadata: meta };
         }
         groups[key].logs.push(log);
         groups[key].totalHours += (log.billedHours || 0);
      });
      return groups;
   }, [filteredLogs, viewMode]);

   // Initial expansion
   useEffect(() => {
      const groups: Record<string, boolean> = {};
      Object.keys(groupedData).forEach(key => groups[key] = true);
      setExpandedGroups(groups);
   }, [groupedData]);

   const toggleGroup = (key: string) => {
      setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
   };

   const toggleShowAll = (key: string) => {
      setShowAllForDay(prev => ({ ...prev, [key]: !prev[key] }));
   };

   const totalBilled = filteredLogs.reduce((acc, log) => acc + (log.billedHours || log.hours), 0);
   const formattedRange = dateRange.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

   // Mock Budget Data
   const totalBudget: number = 1000;
   const totalUsed = 245;
   const budgetPercent = Math.round((totalUsed / totalBudget) * 100);

   const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDateRange(e.target.value as DateRange);
   };

   // Helper for Daily Stats in Header
   const getDailyStats = (logs: WorkLog[]) => {
      const uniqueUsers = new Set(logs.map(l => l.userId));
      const uniqueTasks = new Set(logs.map(l => l.taskId));
      return {
         users: uniqueUsers.size,
         tasks: uniqueTasks.size
      };
   };

   return (
      <div className="space-y-6 animate-fade-in">
         {/* Metrics Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget Utilization */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div className='flex-1'>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Budget Utilization (Total)</h3>
                  <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-extrabold text-slate-900">{budgetPercent}%</span>
                     <span className="text-xs font-bold text-slate-400">consumed</span>
                  </div>
                  <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-slate-300 h-full rounded-full" style={{ width: `${budgetPercent}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                     <span>Used: {totalUsed}h</span>
                     <span>Total: {totalBudget}h</span>
                  </div>
               </div>
               <div className="h-16 w-16 text-slate-200 ml-4">
                  <PieChart className="w-full h-full" />
               </div>
            </div>

            {/* Balance Remaining */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div>
                  <div className="mb-4 text-emerald-500 bg-emerald-50 p-2 rounded-lg w-fit">
                     <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Balance Remaining</h3>
                  <div className="text-3xl font-extrabold text-slate-900">-</div>
               </div>
               <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Hours</div>
            </div>

            {/* Activity Logged */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div>
                  <div className="flex justify-between items-start w-full">
                     <div className="mb-4 text-indigo-500 bg-indigo-50 p-2 rounded-lg w-fit">
                        <TrendingUp className="w-5 h-5" />
                     </div>
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Activity Logged</h3>
                  <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-extrabold text-slate-900">{totalBilled.toFixed(1)}</span>
                     <span className="text-sm font-bold text-slate-500">hrs</span>
                  </div>
               </div>
               <div className="text-xs font-bold text-indigo-100 bg-indigo-600 px-2 py-1 rounded">{formattedRange}</div>
            </div>
         </div>

         {/* Filter & List Card */}
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

            {/* Header / Filter Toolbar */}
            <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <Calendar className="w-5 h-5 text-indigo-600" /> Activity Log
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Showing entries for <span className="font-bold text-slate-700">{formattedRange}</span></p>
               </div>

               <div className="flex items-center gap-3">
                  {/* Range Selector */}
                  <div className="relative">
                     <select
                        value={dateRange}
                        onChange={handleRangeChange}
                        className="appearance-none bg-white border border-slate-200 pl-9 pr-8 py-1.5 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:bg-slate-50 transition-colors"
                     >
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="last_week">Last Week</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="all">All Time</option>
                     </select>
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>

                  {/* View Switcher */}
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                     <button
                        onClick={() => setViewMode('date')}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${viewMode === 'date' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        Date
                     </button>
                     <button
                        onClick={() => setViewMode('resource')}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${viewMode === 'resource' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        Resource
                     </button>
                     <button
                        onClick={() => setViewMode('task')}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${viewMode === 'task' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        Task
                     </button>
                  </div>

                  {/* Density Toggle */}
                  <div className="flex bg-slate-100 p-1 rounded-lg" title="Toggle Density">
                     <button
                        onClick={() => setDensity('comfortable')}
                        className={`p-1.5 rounded-md text-slate-500 transition-all ${density === 'comfortable' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-700'}`}
                     >
                        <AlignJustify className="w-3.5 h-3.5" />
                     </button>
                     <button
                        onClick={() => setDensity('compact')}
                        className={`p-1.5 rounded-md text-slate-500 transition-all ${density === 'compact' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-700'}`}
                     >
                        <AlignLeft className="w-3.5 h-3.5" />
                     </button>
                  </div>

                  <button className="flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                     <Download className="w-3.5 h-3.5" /> Report
                  </button>
               </div>
            </div>

            {/* List */}
            <div className="min-h-[300px]">
               {Object.keys(groupedData).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                     <Filter className="w-12 h-12 mb-3 opacity-20" />
                     <p className="text-sm font-medium">No activity found</p>
                  </div>
               ) : (
                  <div className="divide-y divide-slate-100">
                     {Object.keys(groupedData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(key => {
                        const group = groupedData[key];
                        const isExpanded = expandedGroups[key] !== false;
                        const stats = viewMode === 'date' ? getDailyStats(group.logs) : null;

                        // Progressive Disclosure Logic
                        const shouldShowAll = showAllForDay[key] || false;
                        const MAX_ITEMS = 5;
                        const visibleLogs = (shouldShowAll || group.logs.length <= MAX_ITEMS) ? group.logs : group.logs.slice(0, MAX_ITEMS);
                        const hiddenCount = group.logs.length - MAX_ITEMS;

                        return (
                           <div key={key} className="bg-white group">
                              <div
                                 className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                 onClick={() => toggleGroup(key)}
                              >
                                 <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded transition-transform duration-200 ${isExpanded ? 'rotate-90 text-indigo-500' : 'text-slate-400'}`}>
                                       <ChevronRight className="w-4 h-4" />
                                    </div>

                                    {/* Group Icon */}
                                    {viewMode === 'task' && <div className="hidden md:flex p-1.5 bg-indigo-50 text-indigo-600 rounded"><CheckSquare className="w-4 h-4" /></div>}
                                    {viewMode === 'date' && <div className="hidden md:flex p-1.5 bg-blue-50 text-blue-600 rounded"><Calendar className="w-4 h-4" /></div>}
                                    {viewMode === 'resource' && <div className="hidden md:flex p-1.5 bg-purple-50 text-purple-600 rounded"><Users className="w-4 h-4" /></div>}

                                    <div className="flex items-center gap-3">
                                       <h4 className="text-sm font-bold text-slate-800">
                                          {viewMode === 'task' ? group.metadata.title :
                                             viewMode === 'date' ? new Date(key).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) :
                                                group.metadata.name}
                                       </h4>

                                       {/* Rich Header Stats (Date View Only) */}
                                       {viewMode === 'date' && stats && (
                                          <div className="hidden md:flex items-center gap-3 ml-2">
                                             <span className="text-slate-300">|</span>
                                             <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold" title="Unique Team Members">
                                                <Users className="w-3 h-3 text-slate-400" />
                                                {stats.users}
                                             </div>
                                             <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold" title="Distinct Tasks">
                                                <CheckSquare className="w-3 h-3 text-slate-400" />
                                                {stats.tasks}
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-4">
                                    {viewMode === 'task' && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{group.logs.length} entries</span>}
                                    <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 min-w-[80px] text-center">
                                       {group.totalHours.toFixed(2)} hrs
                                    </div>
                                 </div>
                              </div>

                              {/* Entries */}
                              {isExpanded && (
                                 <div className="bg-slate-50/30 border-t border-slate-100 divide-y divide-slate-50">
                                    {visibleLogs.map(log => {
                                       // SANITIZATION
                                       const isGhost = log.userName.includes('Shadow') || log.userId === 'u4';
                                       const displayAvatar = isGhost ? 'CT' : log.userAvatar;
                                       const avatarColor = isGhost ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-600';

                                       // Density Styling
                                       const paddingY = density === 'compact' ? 'py-2' : 'py-3';
                                       const avatarSize = density === 'compact' ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-[10px]';

                                       return (
                                          <div key={log.id} className={`px-6 ${paddingY} pl-14 md:pl-20 flex items-center justify-between hover:bg-white transition-colors group/item`}>
                                             <div className="flex items-center gap-4">
                                                {viewMode !== 'resource' && (
                                                   <div className={`${avatarSize} rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm border border-white ${avatarColor} overflow-hidden`}>
                                                      {isGhost ? <Shield className="w-3 h-3" /> : (
                                                         displayAvatar.startsWith('http') ?
                                                            <img src={displayAvatar} alt={log.userName} className="w-full h-full object-cover" /> :
                                                            displayAvatar
                                                      )}
                                                   </div>
                                                )}
                                                <div>
                                                   {viewMode !== 'task' && (
                                                      <div className="flex items-center gap-2">
                                                         <h5 className="text-sm font-bold text-slate-700 mb-0.5">{log.taskTitle}</h5>
                                                         {/* Count Badge for Merged Logs */}
                                                         {(log as any)._count > 1 && (
                                                            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-500">
                                                               {(log as any)._count} entries
                                                            </span>
                                                         )}
                                                      </div>
                                                   )}
                                                   <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                                      {/* Show timestamp in all views */}
                                                      <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
                                                         {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                      </div>
                                                      <div className={`text-xs font-medium ${isGhost ? 'text-slate-400 italic' : 'text-slate-600'}`}>{isGhost ? 'Collab Team Member' : log.userName}</div>
                                                      <span className="hidden md:inline text-slate-300">•</span>
                                                      <div className={`text-xs text-slate-500 max-w-md ${density === 'compact' ? 'truncate' : ''}`} title={log.description}>{log.description}</div>
                                                   </div>
                                                </div>
                                             </div>
                                             <span className="text-sm font-bold text-slate-900">{log.billedHours?.toFixed(2)}h</span>
                                          </div>
                                       );
                                    })}

                                    {/* Progressive Disclosure Button */}
                                    {!shouldShowAll && hiddenCount > 0 && (
                                       <button
                                          onClick={() => toggleShowAll(key)}
                                          className="w-full py-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors border-t border-indigo-100 flex items-center justify-center gap-1"
                                       >
                                          Show {hiddenCount} more activities from this group <ChevronDown className="w-3 h-3" />
                                       </button>
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
