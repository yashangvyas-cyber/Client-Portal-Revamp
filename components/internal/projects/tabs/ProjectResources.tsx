import React, { useState } from 'react';
import { Project, ProjectType, Resource, User } from '../../../../types';
import { Search, Plus, MessageSquare, Edit2, Trash2, Info, X, Check } from 'lucide-react';
import { useSharedData } from '../../../../context/SharedDataContext';

interface ProjectResourcesProps {
   project: Project;
}

export const ProjectResources: React.FC<ProjectResourcesProps> = ({ project }) => {
   const { updateProject, currentUser } = useSharedData();
   const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);

   // Form State
   const [newResName, setNewResName] = useState('');
   const [newResRole, setNewResRole] = useState('');
   const [newResType, setNewResType] = useState('Developer');
   const [newResStartDate, setNewResStartDate] = useState('');
   const [newResEndDate, setNewResEndDate] = useState('');
   const [newResClientVisible, setNewResClientVisible] = useState(true);
   const [newResClientComm, setNewResClientComm] = useState(false);

   // Helper to get resources list based on project type
   const getResources = () => {
      if (project.type === ProjectType.HIRE_BASE && project.resources) {
         return project.resources.map((res, idx) => ({
            id: res.user.id,
            name: res.user.name,
            role: res.user.role,
            avatar: res.user.avatar,
            projectRole: res.role,
            startDate: res.startDate,
            endDate: res.endDate || '-',
            status: 'Active',
            clientVisible: res.isClientVisible !== false,
            clientComm: res.clientCommunication ? 'Enabled' : 'Disabled',
            addedBy: 'Manager', // Mock for now
            addedOn: 'Recently'
         }));
      } else if (project.team) {
         return project.team.map((member, idx) => ({
            id: member.user.id,
            name: member.user.name,
            role: member.user.role,
            avatar: member.user.avatar,
            projectRole: member.role,
            startDate: project.startDate || '-',
            endDate: '-',
            status: 'Active',
            clientVisible: true, // Legacy/Default true
            clientComm: 'Disabled',
            addedBy: 'System',
            addedOn: project.startDate || '-'
         }));
      }
      return [];
   };

   const resources = getResources();

   const handleAddResource = () => {
      if (!newResName || !newResRole) {
         alert("Please enter Name and Role");
         return;
      }

      // Create a new User object (Mock ID)
      const newUser: User = {
         id: `u-${Date.now()}`,
         name: newResName,
         email: `${newResName.toLowerCase().replace(' ', '.')}@example.com`,
         avatar: '',
         role: newResType as any
      };

      // Create new Resource object
      const newResource: Resource = {
         user: newUser,
         role: newResRole,
         startDate: newResStartDate || new Date().toISOString().split('T')[0],
         endDate: newResEndDate,
         monthlyRate: 0,
         isClientVisible: newResClientVisible,
         clientCommunication: newResClientComm
      };

      // Update Project
      // Note: Logic differs for HIRE_BASE vs others in types, but we'll try to unify or handle both
      // For prototype simplicity, we push to 'resources' if HIRE_BASE, else 'team'

      const updatedProject = { ...project };

      if (project.type === ProjectType.HIRE_BASE) {
         updatedProject.resources = [...(project.resources || []), newResource];
      } else {
         // Map Resource to TeamMember for other types
         const newMember = { user: newUser, role: newResRole as any }; // Simplified casting
         updatedProject.team = [...(project.team || []), newMember];
      }

      updateProject(project.id, updatedProject);
      setIsAddResourceOpen(false);

      // Reset
      setNewResName('');
      setNewResRole('');
      setNewResClientVisible(true);
      setNewResClientComm(false);
   };

   return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
         {/* Header Toolbar */}
         <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
               <h3 className="text-lg font-bold text-slate-800">Resources</h3>
               <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                  {resources.length} Resources
               </span>
            </div>

            <div className="flex items-center gap-3">
               <button
                  onClick={() => setIsAddResourceOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
               >
                  <Plus className="w-4 h-4" /> Add Resource
               </button>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Role</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Access</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Messages</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {resources.map((res, index) => (
                     <tr key={index} className={`hover:bg-slate-50 transition-colors group ${!res.clientVisible ? 'bg-slate-50/50' : ''}`}>
                        <td className="px-6 py-5 text-sm font-medium text-slate-800">{index + 1}</td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border bg-slate-100 text-slate-500 border-slate-200`}>
                                 {res.avatar || res.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-slate-800">{res.name}</div>
                                 <div className="text-xs text-slate-500">{res.role}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-700">
                           {res.projectRole}
                        </td>
                        <td className="px-6 py-5">
                           <span className={`px-2.5 py-1 rounded text-xs font-bold border ${res.clientVisible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                              {res.clientVisible ? 'Visible' : 'Hidden'}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           <span className={`px-2.5 py-1 rounded text-xs font-bold border ${res.clientComm === 'Enabled' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                              {res.clientComm}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2 text-slate-400">
                              <Edit2 className="w-4 h-4 hover:text-indigo-600 cursor-pointer" />
                              <Trash2 className="w-4 h-4 hover:text-red-600 cursor-pointer" />
                           </div>
                        </td>
                     </tr>
                  ))}
                  {resources.length === 0 && (
                     <tr><td colSpan={6} className="text-center py-8 text-slate-400 italic">No resources found.</td></tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* ADD RESOURCE SLIDE-OVER (RSP) */}
         {isAddResourceOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
               <div
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                  onClick={() => setIsAddResourceOpen(false)}
               />
               <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">

                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                     <div>
                        <h3 className="text-xl font-bold text-slate-900">Add Resource</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Add a new team member to this project.</p>
                     </div>
                     <button onClick={() => setIsAddResourceOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Resource Name <span className="text-red-500">*</span></label>
                        <input
                           type="text"
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                           placeholder="e.g. John Doe"
                           value={newResName}
                           onChange={e => setNewResName(e.target.value)}
                        />
                     </div>

                     <div className="space-y-6">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Internal Role</label>
                           <select
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                              value={newResType}
                              onChange={e => setNewResType(e.target.value)}
                           >
                              <option value="Developer">Developer</option>
                              <option value="Designer">Designer</option>
                              <option value="manager">Manager</option>
                              <option value="QA">QA</option>
                           </select>
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Role <span className="text-red-500">*</span></label>
                           <input
                              type="text"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                              placeholder="e.g. Senior Frontend Dev"
                              value={newResRole}
                              onChange={e => setNewResRole(e.target.value)}
                           />
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Date</label>
                           <input
                              type="date"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                              value={newResStartDate}
                              onChange={e => setNewResStartDate(e.target.value)}
                           />
                        </div>
                     </div>

                     <hr className="border-slate-100 my-2" />

                     {/* VISIBILITY CONTROLS */}
                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Access & Privacy</label>

                        {/* Client Communication */}
                        <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setNewResClientComm(!newResClientComm)}>
                           <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${newResClientComm ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                              {newResClientComm && <Check className="w-3.5 h-3.5 text-white" />}
                           </div>
                           <div>
                              <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Grant Client Communication</span>
                              <span className="block text-xs text-slate-500 mt-0.5">Allow this resource to message the client directly.</span>
                           </div>
                        </div>

                        {/* Client Visibility Toggle */}
                        <div className={`flex items-start gap-4 p-4 border rounded-xl transition-all cursor-pointer group ${newResClientVisible ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50'}`} onClick={() => setNewResClientVisible(!newResClientVisible)}>
                           <div className={`mt-1 w-10 h-5 rounded-full relative transition-colors ${newResClientVisible ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${newResClientVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                           </div>
                           <div>
                              <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Visible to Client</span>
                              <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
                                 {newResClientVisible
                                    ? "This resource will appear in the Client Portal team list."
                                    : "This resource is a GHOST and will be HIDDEN from the client."}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
                     <button onClick={() => setIsAddResourceOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors">
                        Cancel
                     </button>
                     <button
                        onClick={handleAddResource}
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                     >
                        Add Resource
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
};