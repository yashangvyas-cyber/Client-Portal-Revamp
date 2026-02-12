
import React, { useState } from 'react';
import { Project, ClientRequest } from '../../../../types';
import { Search, AlertCircle, CheckSquare, MessageSquare, ArrowRight, Ban, Check, RefreshCw, X, ArrowUpRight, ChevronDown, Paperclip, Eye, ExternalLink } from 'lucide-react';

interface ProjectClientRequestsProps {
  project: Project;
  onRequestConvert?: (req: ClientRequest) => void;
}

export const ProjectClientRequests: React.FC<ProjectClientRequestsProps> = ({ project, onRequestConvert }) => {
  const [requests, setRequests] = useState<ClientRequest[]>(project.clientRequests || []);
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);

  const handleStatusChange = (reqId: string, newStatus: ClientRequest['status']) => {
    setRequests(prev => prev.map(req => req.id === reqId ? { ...req, status: newStatus } : req));
  };

  const handleConvertClick = (req: ClientRequest) => {
      // Close triage modal
      setSelectedRequest(null);
      // Change status to converted
      handleStatusChange(req.id, 'Converted to Task');
      // Trigger parent handler to open create issue modal
      if(onRequestConvert) onRequestConvert(req);
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
      {/* Request Triage Modal (View Details) */}
      {selectedRequest && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                 <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedRequest.type === 'Bug' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                             {selectedRequest.type === 'Bug' ? <AlertCircle className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                         </div>
                         <div>
                             <h3 className="text-sm font-bold text-slate-800">Request Details</h3>
                             <p className="text-[10px] text-slate-500 font-mono">{selectedRequest.id}</p>
                         </div>
                     </div>
                     <button onClick={() => setSelectedRequest(null)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                         <X className="w-5 h-5" />
                     </button>
                 </div>
                 
                 <div className="p-8 space-y-6 overflow-y-auto">
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Subject</label>
                         <div className="text-lg font-bold text-slate-900 leading-tight">{selectedRequest.title}</div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                         <div>
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Submitted By</label>
                             <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                     {selectedRequest.submittedBy.name.substring(0,2)}
                                 </div>
                                 <span className="text-sm font-semibold text-slate-700">{selectedRequest.submittedBy.name}</span>
                             </div>
                         </div>
                         <div>
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Date</label>
                             <div className="text-sm font-semibold text-slate-700">{selectedRequest.submittedAt}</div>
                         </div>
                     </div>
                     
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                         <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                             {selectedRequest.description}
                         </div>
                     </div>

                     {/* Mock Attachments */}
                     <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Attachments</label>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">
                                <Paperclip className="w-3.5 h-3.5" /> screenshot_error.png
                            </div>
                        </div>
                     </div>
                 </div>

                 <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                     <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-slate-500">Current Status:</span>
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            selectedRequest.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            selectedRequest.status === 'Converted to Task' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-slate-100 text-slate-500 border-slate-200'
                         }`}>
                            {selectedRequest.status}
                         </span>
                     </div>
                     
                     <div className="flex gap-3">
                         {selectedRequest.status === 'Pending' && (
                             <>
                                <button 
                                    onClick={() => { handleStatusChange(selectedRequest.id, 'Rejected'); setSelectedRequest(null); }}
                                    className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-red-600 transition-colors"
                                >
                                    Reject Request
                                </button>
                                <button 
                                    onClick={() => handleConvertClick(selectedRequest)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
                                >
                                    <CheckSquare className="w-3.5 h-3.5" /> Convert to Task
                                </button>
                             </>
                         )}
                         {selectedRequest.status === 'Converted to Task' && (
                             <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold flex items-center gap-2 cursor-not-allowed">
                                 <Check className="w-3.5 h-3.5" /> Converted
                             </button>
                         )}
                     </div>
                 </div>
             </div>
         </div>
      )}

      {/* Header Toolbar */}
      <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-800">Client Requests</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pendingCount > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {pendingCount} Pending Review
          </span>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
             <input 
               type="text" 
               placeholder="Search requests..." 
               className="pl-4 pr-10 py-2 w-64 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
             />
             <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
           </div>
           <button className="p-2 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
             <tr>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No.</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request Details</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted By</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
               <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Triage</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req, index) => (
               <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium text-slate-800">{index + 1}</td>
                  <td className="px-6 py-5">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${req.type === 'Bug' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {req.type === 'Bug' ? <AlertCircle className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                     </div>
                  </td>
                  <td className="px-6 py-5 max-w-sm cursor-pointer" onClick={() => setSelectedRequest(req)}>
                     <div className="font-bold text-sm text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{req.title}</div>
                     <p className="text-xs text-slate-500 line-clamp-2">{req.description}</p>
                  </td>
                  <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          req.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                          req.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                          {req.priority || 'Normal'}
                      </span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                             {req.submittedBy.name.substring(0,2)}
                         </div>
                         <div>
                             <div className="text-xs font-bold text-slate-700">{req.submittedBy.name}</div>
                             <div className="text-[10px] text-slate-400">{req.submittedAt}</div>
                         </div>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        req.status === 'Converted to Task' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        req.status === 'Rejected' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                     }`}>
                        {req.status}
                     </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <button 
                        onClick={() => setSelectedRequest(req)}
                        className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                     >
                        <Eye className="w-4 h-4" />
                     </button>
                  </td>
               </tr>
            ))}
            {requests.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 italic">No client requests found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
