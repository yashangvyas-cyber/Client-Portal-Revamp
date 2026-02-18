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
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border bg-slate-100 text-slate-500 border-slate-200 overflow-hidden flex-shrink-0`}>
                                 {res.avatar
                                    ? <img src={res.avatar} alt={res.name} className="w-full h-full object-cover" />
                                    : res.name.substring(0, 2).toUpperCase()
                                 }
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
                     <h3 className="text-lg font-bold text-slate-900">Add Resource</h3>
                     <button onClick={() => setIsAddResourceOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">

                     {/* Select Resource */}
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Select Resource <span className="text-red-500">*</span></label>
                        <select
                           className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                           value={newResName}
                           onChange={e => setNewResName(e.target.value)}
                        >
                           <option value="">Select</option>
                           <option value="John Doe">John Doe</option>
                           <option value="Jane Smith">Jane Smith</option>
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        {/* Project Role */}
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1.5">Project Role <span className="text-red-500">*</span></label>
                           <select
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                              value={newResRole}
                              onChange={e => setNewResRole(e.target.value)}
                           >
                              <option value="">Select</option>
                              <option value="Developer">Developer</option>
                              <option value="Designer">Designer</option>
                              <option value="BA">Business Analyst</option>
                           </select>
                        </div>

                        {/* Access Level */}
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1.5">Access Level <span className="text-red-500">*</span></label>
                           <select
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                              value={newResType}
                              onChange={e => setNewResType(e.target.value)}
                           >
                              <option value="">Select</option>
                              <option value="Admin">Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="Viewer">Viewer</option>
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1.5">Start Date</label>
                           <input
                              type="date"
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                              value={newResStartDate}
                              onChange={e => setNewResStartDate(e.target.value)}
                           />
                        </div>

                        {/* Est. Release Date */}
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1.5">Est. Release Date</label>
                           <input
                              type="date"
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                              value={newResEndDate}
                              onChange={e => setNewResEndDate(e.target.value)}
                           />
                        </div>
                     </div>

                     {/* Comments */}
                     <div>
                        <div className="flex justify-between mb-1.5">
                           <label className="text-xs font-bold text-slate-500">Comments</label>
                           <span className="text-[10px] text-slate-400">0/150</span>
                        </div>
                        <textarea
                           className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none h-24"
                           value="" // Mock
                           readOnly
                        ></textarea>
                     </div>

                     <hr className="border-slate-100" />

                     {/* Client Communication */}
                     <div className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           id="clientComm"
                           checked={newResClientComm}
                           onChange={(e) => setNewResClientComm(e.target.checked)}
                           className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="clientComm" className="text-sm font-medium text-slate-700">Grant Client Communication Access</label>
                        <Info className="w-4 h-4 text-slate-400" />
                     </div>

                     {/* Client Visibility (Ghost Mode) */}
                     <div className={`flex items-start gap-3 p-3 border rounded-lg transition-all cursor-pointer group ${newResClientVisible ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50'}`} onClick={() => setNewResClientVisible(!newResClientVisible)}>
                        <div className={`mt-0.5 w-9 h-5 shrink-0 rounded-full relative transition-colors ${newResClientVisible ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                           <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${newResClientVisible ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <div>
                           <span className="block text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">Visible to Client</span>
                           <span className="block text-xs text-slate-500 mt-0.5 leading-snug">
                              {newResClientVisible
                                 ? "Visible in Client Portal."
                                 : "👻 GHOST RESOURCE: Hidden from client."}
                           </span>
                        </div>
                     </div>

                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-100 bg-white flex gap-3 shrink-0">
                     <button onClick={() => setIsAddResourceOpen(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                        Cancel
                     </button>
                     <button
                        onClick={handleAddResource}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                     >
                        Submit
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
};