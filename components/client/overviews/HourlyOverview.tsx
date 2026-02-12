import React from 'react';
import { Project, ProjectType } from '../../../types';

interface HourlyOverviewProps {
    project: Project;
}

export const HourlyOverview: React.FC<HourlyOverviewProps> = ({ project }) => {
    if (project.type !== ProjectType.HOURLY) return null;

    return (
        <div className="flex gap-6 mt-6">
            {/* LEFT: Summary Cards */}
            <div className="w-1/3 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase">Initially Bought Hours:</span>
                        <span className="text-sm font-bold text-slate-800">{project.initialBoughtHours || 0}</span>
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-emerald-700 uppercase">Top-Up Hours:</span>
                        <span className="text-sm font-bold text-emerald-800">{project.topUps?.reduce((acc, curr) => acc + curr.topUpHours, 0) || 0}</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase">Total Hours:</span>
                        <span className="text-sm font-bold text-slate-800">
                            {(project.initialBoughtHours || 0) + (project.topUps?.reduce((acc, curr) => acc + curr.topUpHours, 0) || 0)}
                        </span>
                    </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-indigo-700 uppercase">Total Billed Hours:</span>
                        <span className="text-sm font-bold text-indigo-800">{project.totalBilledHours || '0:00'}</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase">Balance Hours</span>
                        <span className="text-sm font-bold text-slate-800">
                            {((project.initialBoughtHours || 0) + (project.topUps?.reduce((acc, curr) => acc + curr.topUpHours, 0) || 0) - (project.totalBilledHours || 0)).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Top-Up Table */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">Top-Up Summary (Hours)</h3>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">{project.topUps?.length || 0} Records</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Top-Up Hours</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Added On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {project.topUps?.map((log, index) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{index + 1}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-700">{log.comment}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-800 text-right">{log.topUpHours}</td>
                                    <td className="px-6 py-4 text-xs text-slate-500 text-right">{log.addedOn}</td>
                                </tr>
                            ))}
                            {(!project.topUps || project.topUps.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400 italic">No top-up records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
