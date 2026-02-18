import React, { useState } from 'react';
import { Project } from '../../../../types';
import { Search, Filter } from 'lucide-react';
import { useSharedData } from '../../../../context/SharedDataContext';

interface ProjectLogsProps {
  project: Project;
}

// Role badge color mapping
const getRoleBadgeStyle = (role: string) => {
  const r = role?.toLowerCase() || '';
  if (r.includes('project manager') || r.includes('pm')) return 'bg-purple-100 text-purple-700 border-purple-200';
  if (r.includes('developer') || r.includes('engineer')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (r.includes('designer')) return 'bg-pink-100 text-pink-700 border-pink-200';
  if (r.includes('qa') || r.includes('quality')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (r.includes('business analyst') || r.includes('ba')) return 'bg-teal-100 text-teal-700 border-teal-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

// Avatar color mapping (consistent per name)
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500',
    'bg-violet-500', 'bg-lime-500', 'bg-sky-500', 'bg-fuchsia-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const ProjectLogs: React.FC<ProjectLogsProps> = ({ project }) => {
  const { logs } = useSharedData();
  const [search, setSearch] = useState('');

  // Build resource list from project team/resources with their logged hours
  const resources = (() => {
    const members: { id: string; name: string; avatar?: string; role: string; subRole: string; loggedHours: number; isGhost?: boolean }[] = [];

    if (project.team) {
      project.team.forEach(member => {
        // Sum hours from logs for this user
        const userLogs = logs.filter(l => l.userId === member.user.id || l.userName === member.user.name);
        const totalHours = userLogs.reduce((sum, l) => sum + (l.hours || 0), 0);
        members.push({
          id: member.user.id,
          name: member.user.name,
          avatar: member.user.avatar,
          role: member.role || member.user.role || 'Developer',
          subRole: member.user.role || 'associate, software engineer',
          loggedHours: totalHours,
        });
      });
    }

    if (project.resources) {
      project.resources.forEach(res => {
        if (members.find(m => m.id === res.user.id)) return; // skip duplicates
        const userLogs = logs.filter(l => l.userId === res.user.id || l.userName === res.user.name);
        const totalHours = userLogs.reduce((sum, l) => sum + (l.hours || 0), 0);
        members.push({
          id: res.user.id,
          name: res.user.name,
          avatar: res.user.avatar,
          role: res.role || res.user.role || 'Developer',
          subRole: res.user.role || 'associate, software engineer',
          loggedHours: totalHours,
          isGhost: res.isClientVisible === false,
        });
      });
    }

    return members;
  })();

  const filtered = resources.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.role.toLowerCase().includes(search.toLowerCase())
  );

  // Format hours as HH:MM
  const formatHours = (h: number) => {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Project Logs</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter Results..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button className="px-6 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resource</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              Logged Hours
              <span className="ml-1 text-slate-400 font-normal normal-case">WK4 ↕</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filtered.length > 0 ? (
            filtered.map((res, index) => (
              <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-500">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden ${getAvatarColor(res.name)}`}>
                      {res.avatar
                        ? <img src={res.avatar} alt={res.name} className="w-full h-full object-cover" />
                        : res.name.substring(0, 2).toUpperCase()
                      }
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        {res.name}
                        {res.isGhost && (
                          <span className="text-[10px] text-slate-400 font-normal">👻 ghost</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 lowercase">{res.subRole}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${getRoleBadgeStyle(res.role)}`}>
                    {res.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-slate-800 tabular-nums">
                    {formatHours(res.loggedHours)}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                No resources found for this project
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};