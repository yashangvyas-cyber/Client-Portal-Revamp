import React from 'react';
import { Project, ProjectType } from '../../../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface FixedOverviewProps {
    project: Project;
}

export const FixedOverview: React.FC<FixedOverviewProps> = ({ project }) => {
    if (project.type !== ProjectType.FIXED) return null;

    return (
        <div className="flex gap-6 mt-6 max-h-[600px]">
            {/* LEFT: Milestones List */}
            <div className="w-1/2 flex flex-col">
                <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Milestones</h3>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 overflow-y-auto">
                    {project.milestones && project.milestones.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {project.milestones.map((milestone) => (
                                <div key={milestone.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${milestone.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                            milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {milestone.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm">{milestone.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-400 font-mono">{milestone.code}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${milestone.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    milestone.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                {milestone.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                            <Clock className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm">No milestones found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Change Requests Table */}
            <div className="w-1/2 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Change Requests</h3>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">{project.changeRequests?.length || 0} Request{project.changeRequests?.length !== 1 && 's'}</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Added On</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Free of Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {project.changeRequests?.map((req, index) => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{index + 1}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-700">{req.comment}</td>
                                    <td className="px-6 py-4 text-xs text-slate-500 text-right">{req.addedOn}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-right">
                                        {req.isFreeOfCost ? <span className="text-emerald-600">Yes</span> : <span className="text-slate-400">No</span>}
                                    </td>
                                </tr>
                            ))}
                            {(!project.changeRequests || project.changeRequests.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-400 italic">No change requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
