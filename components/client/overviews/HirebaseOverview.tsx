import React, { useState } from 'react';
import { Project, ProjectType, Resource } from '../../../types';
import { CheckCircle2, XCircle, User as UserIcon } from 'lucide-react';

interface HirebaseOverviewProps {
    project: Project;
}

const UserAvatar = ({ name, role, size = "w-8 h-8", fontSize = "text-[10px]" }: { name: string, role?: string, size?: string, fontSize?: string }) => (
    <div className="flex items-center gap-3">
        <div className={`${size} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ${fontSize} font-bold text-white shadow-md ring-2 ring-white`}>
            {name.substring(0, 2).toUpperCase()}
        </div>
        {(role || name) && (
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">{name}</span>
                {role && <span className="text-[11px] font-medium text-slate-400">{role}</span>}
            </div>
        )}
    </div>
);

export const HirebaseOverview: React.FC<HirebaseOverviewProps> = ({ project }) => {
    if (project.type !== ProjectType.HIRE_BASE) return null;

    const [resourceFilter, setResourceFilter] = useState<'Current' | 'Past'>('Current');

    // Mock deal owner if not present (since we just added the field)
    const dealOwner = project.dealOwner || { id: 'u1', name: 'Harvey Specter', email: 'harvey@pearson-hardman.com', role: 'manager', avatar: '' };
    const dealName = "Alpha Software Requirement Hired"; // Verify if we can get this from props or project

    return (
        <div className="mt-6 space-y-8 animate-fade-in">

            {/* 1. Project Metadata Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">

                {/* Row 1: Status & Associated Deal */}
                <div className="flex items-center">
                    <span className="text-xs font-bold text-slate-500 w-32">Status:</span>
                    <span className="text-sm font-bold text-slate-800">{project.status}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-xs font-bold text-slate-500 w-32">Associated Deal:</span>
                    <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                        {dealName}
                    </a>
                </div>

                {/* Row 2: NDA & Deal Owner */}
                <div className="flex items-center">
                    <span className="text-xs font-bold text-slate-500 w-32">NDA:</span>
                    {project.ndaSigned ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                            <XCircle className="w-3.5 h-3.5" /> Not Signed
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    <span className="text-xs font-bold text-slate-500 w-32">Deal Owner:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">
                            {dealOwner?.name ? dealOwner.name.substring(0, 2).toUpperCase() : '-'}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{dealOwner?.name || 'Unknown'}</span>
                    </div>
                </div>
            </div>

            {/* 2. Dedicated Resources Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-fit">
                    <h3 className="text-sm font-bold text-slate-800 px-3 py-1.5 mr-4">Dedicated Resources <span className="ml-2 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{project.resources?.length || 0} Resources</span></h3>
                    <div className="flex bg-white rounded-md border border-slate-200 p-0.5">
                        <button
                            onClick={() => setResourceFilter('Current')}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${resourceFilter === 'Current' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Current
                        </button>
                        <button
                            onClick={() => setResourceFilter('Past')}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${resourceFilter === 'Past' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Past
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-16">No.</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Total Working Days</th>
                                <th className="px-6 py-4">Expires In</th>
                                <th className="px-6 py-4">Hired For</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {project.resources?.map((res, index) => (
                                <tr key={res.id || index} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-5 text-sm text-slate-400 font-medium">{index + 1}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                {res.name ? res.name.substring(0, 2).toUpperCase() : '?'}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{res.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col text-xs text-slate-500 font-medium">
                                            <span>From: <span className="text-slate-800">{res.startDate || '-'}</span></span>
                                            <span>To: <span className="text-slate-800">{res.endDate || '-'}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-700">{res.totalWorkingDays || 0} Days</td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-700">{res.expiresIn || 0} Days</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">{res.hiredFor || res.role || '-'}</td>
                                </tr>
                            ))}
                            {(!project.resources || project.resources.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                                        No dedicated resources assigned yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
