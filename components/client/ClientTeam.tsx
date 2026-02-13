import React, { useMemo } from 'react';
import { Project, ProjectType, Resource } from '../../types';
import { Mail, Clock, Calendar, Shield, Briefcase } from 'lucide-react';

interface ClientTeamProps {
    project: Project;
    onMessageUser?: (userId: string) => void;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    isGhost: boolean;
    // Dynamic KPI fields
    kpiLabel?: string;
    kpiValue?: string;
    progress?: number; // 0-100 for progress bar
    status: 'Active' | 'Inactive';
}

export const ClientTeam: React.FC<ClientTeamProps> = ({ project, onMessageUser }) => {

    const teamMembers: TeamMember[] = useMemo(() => {
        const members: TeamMember[] = [];

        // 1. Always add Project Manager (Visible for all)
        if (project.projectManager) {
            members.push({
                id: project.projectManager.id,
                name: project.projectManager.name,
                role: 'Project Manager',
                avatar: project.projectManager.avatar,
                isGhost: false,
                status: 'Active',
                kpiLabel: 'Project Lead',
                kpiValue: 'Since Project Start'
            });
        }

        // 2. Hirebase: Show Contract Resources
        if (project.type === ProjectType.HIRE_BASE && project.resources) {
            project.resources.forEach(res => {
                // Check Client Visibility (Ghost Resource Logic)
                if (res.isClientVisible === false) return;

                // Calculate days remaining simple mock or real
                const daysRemaining = res.expiresIn || 12;
                const totalDays = res.totalWorkingDays || 30;
                const progress = Math.round((daysRemaining / totalDays) * 100);

                members.push({
                    id: res.user?.id || `res-${Math.random()}`,
                    name: res.user?.name || 'Unknown Resource',
                    role: res.role || 'Dedicated Developer',
                    avatar: res.user?.avatar,
                    isGhost: false,
                    status: 'Active',
                    kpiLabel: 'Contract Period',
                    kpiValue: `${daysRemaining} days left`,
                    progress: progress
                });
            });
        }

        // 3. Fixed/Hourly: Generate Virtual Team (Mock/Simulated for Prototype)
        // in real app, distinct users from project.team
        if (project.type !== ProjectType.HIRE_BASE) {
            // Mock Senior Dev
            members.push({
                id: 'dev-1',
                name: 'Harvey Spector',
                role: 'Senior Developer',
                avatar: 'HS', // Initials for UI
                isGhost: false,
                status: 'Active',
                kpiLabel: 'Contribution',
                kpiValue: '140 Hrs Logged'
            });

            // Mock Designer
            members.push({
                id: 'des-1',
                name: 'Donna Paulsen',
                role: 'UI/UX Designer',
                avatar: 'DP',
                isGhost: false,
                status: 'Active',
                kpiLabel: 'Contribution',
                kpiValue: '45 Hrs Logged'
            });
        }

        return members;
    }, [project]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Project Resources</h2>
                    <p className="text-sm text-slate-500 mt-1">1-{teamMembers.length} of {teamMembers.length} Resources</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                </div>
            </div>

            {/* List/Table Layout */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">No.</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Project Role</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {teamMembers.map((member, index) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200 overflow-hidden shrink-0">
                                                {member.avatar && member.avatar.length > 2 ? (
                                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{member.avatar || (member.name ? member.name.substring(0, 2).toUpperCase() : '??')}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{member.name}</div>
                                                <div className="text-xs text-slate-400">{member.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded border border-indigo-100">
                                            {member.role === 'Project Manager' ? 'Project Manager (PM)' : member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-slate-500">
                                            <div>From: {project.type === ProjectType.HIRE_BASE ? '05/Feb/2026' : '-'}</div>
                                            <div>To: {project.type === ProjectType.HIRE_BASE ? '06/Feb/2026' : '-'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium">
                                        {project.type === ProjectType.HIRE_BASE ? '2D' : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${member.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onMessageUser && onMessageUser(member.id)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group-hover:visible"
                                                title="Message"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mock) */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <div className="text-xs text-slate-500 font-medium">Records Per Page: 10</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 hover:bg-slate-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold shadow-sm">1</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">2</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
