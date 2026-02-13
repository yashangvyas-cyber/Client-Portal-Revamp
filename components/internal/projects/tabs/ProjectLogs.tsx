import React from 'react';
import { Project } from '../../../../types';
import { Search } from 'lucide-react';
import { useSharedData } from '../../../../context/SharedDataContext';

interface ProjectLogsProps {
  project: Project;
}

export const ProjectLogs: React.FC<ProjectLogsProps> = ({ project }) => {
  const { logs } = useSharedData();

  // Filter logs for this project
  const projectLogs = logs.filter(log =>
    project.tasks?.some(task => task.id === log.taskId)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Project Activity Logs</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter Results..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button className="px-6 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100">
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task ID</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resource</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              Hours Logged
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projectLogs.length > 0 ? (
            projectLogs.map((log, index) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-medium text-slate-800">{index + 1}</td>
                <td className="px-6 py-5">
                  <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 inline-block">
                    {log.taskId}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium text-slate-800">{log.taskTitle}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {log.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{log.userName}</div>
                      <div className="text-xs text-slate-500">{log.timestamp}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-600 max-w-xs truncate" title={log.description}>
                    {log.description}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs text-slate-600">{log.date}</span>
                </td>
                <td className="px-6 py-5 text-right font-bold text-slate-800 text-sm">
                  {log.hours.toFixed(2)}h
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">
                No activity logs found for this project
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};