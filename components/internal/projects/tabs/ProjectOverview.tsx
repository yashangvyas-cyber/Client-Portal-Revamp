import React from 'react';
import { Project, ProjectType } from '../../../../types';
import { Plus, Download, Mail, Phone, Copy } from 'lucide-react';

interface ProjectOverviewProps {
  project: Project;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  
  // -- Helper for Tech Stack --
  const skills = project.requiredSkills || ['React JS', 'Node JS', 'PostgreSQL']; // Mock fallback

  return (
    <div className="grid grid-cols-[1fr_350px] gap-8">
      {/* LEFT COLUMN: Main Info */}
      <div className="space-y-6">
        
        {/* Required Skills Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Required Skills</h3>
              <button className="p-1 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded hover:bg-slate-50 transition-all">
                 <Plus className="w-3.5 h-3.5" />
              </button>
           </div>
           {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                 {skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">
                       {skill}
                    </span>
                 ))}
              </div>
           ) : (
              <div className="text-xs text-slate-400 italic">No specific skills listed.</div>
           )}
        </div>

        {/* Dynamic Type-Specific Card */}
        {project.type === ProjectType.HOURLY && (
           <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-800 text-sm">Hourly Top-Up Summary (Hrs.)</h3>
                 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Remaining Balance: {((project.initialBoughtHours || 0) + (project.topUps?.reduce((acc, c) => acc + c.topUpHours, 0) || 0) - (project.totalBilledHours || 0)).toFixed(2)}
                 </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-lg font-bold text-slate-800">{project.initialBoughtHours || 0}</div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase mt-1">Initial Purchase</div>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-lg font-bold text-slate-800">{project.topUps?.reduce((acc, c) => acc + c.topUpHours, 0) || 0}</div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase mt-1">Additional Top-ups</div>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-lg font-bold text-slate-800">
                       {(project.initialBoughtHours || 0) + (project.topUps?.reduce((acc, c) => acc + c.topUpHours, 0) || 0)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase mt-1">Total Purchased</div>
                 </div>
                 <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="text-lg font-bold text-emerald-700">{project.totalBilledHours || 0}</div>
                    <div className="text-[10px] text-emerald-600 font-medium uppercase mt-1">Total Billed</div>
                 </div>
              </div>
           </div>
        )}

        {project.type === ProjectType.FIXED && (
           <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-800 text-sm">Milestones</h3>
                 <button className="p-1 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded hover:bg-slate-50 transition-all">
                    <Plus className="w-3.5 h-3.5" />
                 </button>
              </div>
              {project.milestones && project.milestones.length > 0 ? (
                 <div className="space-y-3">
                    {project.milestones.map((ms) => (
                       <div key={ms.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                             <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{ms.code}</div>
                             <div className="text-sm font-semibold text-slate-800">{ms.title}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ms.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                             {ms.status}
                          </span>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="text-xs text-slate-400 italic">No milestones defined.</div>
              )}
           </div>
        )}

        {/* Client Details */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
           <h3 className="font-bold text-slate-800 text-sm mb-4">Client Details</h3>
           <div className="grid grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                 <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded mb-3 inline-block">Payment Authority</span>
                 <div className="font-bold text-slate-800 text-sm mb-2">Adrian Andersomn</div>
                 <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       <Phone className="w-3 h-3" /> <span>-</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-indigo-600">
                       <Mail className="w-3 h-3" /> <a href="mailto:crm.test.alpha01@yopmail.com" className="hover:underline">crm.test.alpha01@yopmail.com</a>
                    </div>
                 </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                 <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded mb-3 inline-block">Signing Authority</span>
                 <div className="font-bold text-slate-800 text-sm mb-2">Adrian Anderson</div>
                 <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       <Phone className="w-3 h-3" /> <span>-</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-indigo-600">
                       <Mail className="w-3 h-3" /> <a href="mailto:crm.test.alpha010@yopmail.com" className="hover:underline">crm.test.alpha010@yopmail.com</a>
                    </div>
                 </div>
              </div>
           </div>

           <div className="mt-6 pt-6 border-t border-slate-100 bg-amber-50/50 rounded-lg p-4 border border-amber-100">
              <div className="font-bold text-slate-800 text-sm mb-1">Adrian Anderson</div>
              <div className="text-xs text-slate-500 mb-3">Alpha Industries</div>
              <div className="flex items-center gap-2 text-xs text-indigo-600">
                  <Mail className="w-3 h-3" /> 
                  <a href="mailto:crm.test.alpha010@yopmail.com" className="hover:underline">crm.test.alpha010@yopmail.com</a>
                  <Copy className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
               </div>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Resources & Docs */}
      <div className="space-y-6">
         {/* Resources Card */}
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 text-sm">Recently added resources</h3>
               <button className="p-1 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded hover:bg-slate-50 transition-all">
                  <Plus className="w-3.5 h-3.5" />
               </button>
            </div>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">HS</div>
                     <div>
                        <div className="text-xs font-bold text-slate-700">Harvey Spector</div>
                        <div className="text-[10px] text-slate-400">Business Analyst</div>
                     </div>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">Analyst</span>
               </div>
               <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">SU</div>
                     <div>
                        <div className="text-xs font-bold text-slate-700">Super User</div>
                        <div className="text-[10px] text-slate-400">Project Manager</div>
                     </div>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">Manager</span>
               </div>
            </div>
         </div>

         {/* Documents Card */}
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 text-sm">Documents</h3>
               <button className="p-1 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded hover:bg-slate-50 transition-all">
                  <Plus className="w-3.5 h-3.5" />
               </button>
            </div>
            <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
               <div className="text-xs text-slate-400">Documents not found</div>
            </div>
         </div>
      </div>
    </div>
  );
};