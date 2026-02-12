
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Plus, Calendar, Info, Bold, Italic, Underline, Strikethrough, AlignLeft, List, Link as LinkIcon, Smile, Code, Maximize2, Search, Eye, EyeOff, Ghost } from 'lucide-react';
import { USERS } from '../../../constants';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    title: string;
    description: string;
    type?: string;
    priority?: string;
  };
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({ isOpen, onClose, initialData }) => {
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  
  // Visibility States
  const [isTaskVisible, setIsTaskVisible] = useState(true);
  const [isAssigneeVisible, setIsAssigneeVisible] = useState(true);

  // Default values to match screenshot
  const [selectedReporter, setSelectedReporter] = useState<string>('super'); 
  const [reporterOpen, setReporterOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Pre-fill data when opening with initialData
  useEffect(() => {
    if (initialData && isOpen) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        // Note: Priority/Type could also be mapped here if needed
    } else if (!isOpen) {
        // Reset when closed
        setTitle('');
        setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAssigneeSelect = (userId: string) => {
    setSelectedAssignee(userId);
    setAssigneeOpen(false);
    
    // Auto-detect Ghost Role (Mock Logic: Shadow Dev 'u4' defaults to hidden)
    if (userId === 'ghostDev' || USERS[userId]?.name.includes('Shadow')) {
        setIsAssigneeVisible(false);
    } else {
        setIsAssigneeVisible(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Create Issue</h2>
            <div className="h-6 w-[1px] bg-slate-300"></div>
            <div className="relative">
                <button className="flex items-center gap-2 text-xs font-medium text-slate-600 border border-slate-200 rounded px-3 py-1.5 hover:bg-slate-50">
                    No Epic <ChevronDown className="w-3 h-3" />
                </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {/* Task Visibility Toggle */}
             <button 
                onClick={() => setIsTaskVisible(!isTaskVisible)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${isTaskVisible ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}
                title={isTaskVisible ? "Visible to Client Portal" : "Internal Only (Hidden from Client)"}
             >
                {isTaskVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {isTaskVisible ? 'Client Visible' : 'Internal Only'}
             </button>

             <div className="relative w-32">
                <button className="w-full flex items-center justify-between text-xs font-bold text-white bg-blue-600 border border-blue-700 rounded px-3 py-1.5 hover:bg-blue-700 shadow-sm transition-all">
                    To Do <ChevronDown className="w-3 h-3" />
                </button>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
            {/* Left Content */}
            <div className="flex-1 p-8 overflow-y-auto border-r border-slate-200 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                    <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                        {/* Toolbar */}
                        <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><div className="text-xs font-bold">Normal</div></button>
                            <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Bold className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Italic className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Underline className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Strikethrough className="w-3.5 h-3.5" /></button>
                            <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><AlignLeft className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><List className="w-3.5 h-3.5" /></button>
                            <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><LinkIcon className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Smile className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Code className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500 ml-auto"><Maximize2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-4 h-64 resize-none text-sm text-slate-700 focus:outline-none" 
                            placeholder="Write here..."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-slate-50/30 p-6 overflow-y-auto shrink-0 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="space-y-6 relative">
                    {/* Assignee */}
                    <div className="relative z-30">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-slate-500 font-medium">Assignee</span>
                             {!selectedAssignee && (
                                <div className="flex flex-col items-end gap-1">
                                    <button 
                                        onClick={() => setAssigneeOpen(!assigneeOpen)}
                                        className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded transition-colors border border-indigo-100 shadow-sm"
                                    >
                                        <Plus className="w-3 h-3" /> Add
                                    </button>
                                    <button className="text-[10px] text-indigo-600 hover:underline">Assign to me</button>
                                </div>
                             )}
                        </div>

                        {selectedAssignee && (
                            <div className={`flex items-center gap-2 border rounded-full pl-1 pr-1 py-1 shadow-sm w-fit animate-fade-in ${isAssigneeVisible ? 'bg-white border-slate-200' : 'bg-slate-100 border-slate-300/50'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white relative ${isAssigneeVisible ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-400 grayscale'}`}>
                                     {USERS[selectedAssignee]?.name.substring(0,2).toUpperCase()}
                                     {!isAssigneeVisible && <div className="absolute -bottom-1 -right-1 bg-slate-700 rounded-full p-[1px] border border-white"><Ghost className="w-2 h-2 text-white" /></div>}
                                </div>
                                <span className={`text-xs font-bold ${isAssigneeVisible ? 'text-slate-700' : 'text-slate-500 line-through decoration-slate-300'}`}>
                                    {USERS[selectedAssignee]?.name.split(' ')[0]}
                                </span>
                                
                                {/* Assignee Visibility Toggle */}
                                <button 
                                    onClick={() => setIsAssigneeVisible(!isAssigneeVisible)}
                                    className={`p-1 rounded-full transition-colors ${isAssigneeVisible ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'}`}
                                    title={isAssigneeVisible ? "Visible to Client" : "Hidden (Ghost Mode)"}
                                >
                                    {isAssigneeVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                </button>

                                <div className="w-[1px] h-3 bg-slate-200 mx-0.5"></div>
                                
                                <button onClick={() => setSelectedAssignee(null)} className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"><X className="w-3 h-3" /></button>
                            </div>
                         )}

                        {assigneeOpen && (
                            <div className="absolute right-0 top-8 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 animate-fade-in z-50 ring-1 ring-slate-900/5">
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search" 
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {Object.entries(USERS).map(([key, user]) => (
                                        <button 
                                            key={user.id}
                                            onClick={() => handleAssigneeSelect(key)}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left group"
                                        >
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${user.role === 'client' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>
                                                {user.name.substring(0,2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 block">{user.name}</span>
                                                {user.role === 'developer' && <span className="text-[9px] text-slate-400 flex items-center gap-1"><Ghost className="w-2.5 h-2.5"/> Developer</span>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reporter */}
                    <div className="relative z-20">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">Reporter</span>
                             {!selectedReporter ? (
                                <button className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded transition-colors border border-indigo-100 shadow-sm">
                                    <Plus className="w-3 h-3" /> Add
                                </button>
                             ) : (
                                <div className="flex items-center gap-2 cursor-pointer hover:bg-white/50 p-1 rounded transition-colors" onClick={() => setReporterOpen(!reporterOpen)}>
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-white">
                                         {USERS[selectedReporter]?.name.substring(0,2).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{USERS[selectedReporter]?.name}</span>
                                </div>
                             )}
                        </div>
                        
                         {reporterOpen && (
                            <div className="absolute right-0 top-8 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 animate-fade-in z-50 ring-1 ring-slate-900/5">
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                    <input type="text" placeholder="Search" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {Object.entries(USERS).map(([key, user]) => (
                                        <button 
                                            key={user.id}
                                            onClick={() => { setSelectedReporter(key); setReporterOpen(false); }}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left group"
                                        >
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${user.role === 'client' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-rose-500 to-orange-500'}`}>
                                                {user.name.substring(0,2).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700">{user.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Issue Type */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Issue Type</span>
                        <div className="relative">
                             <button className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors shadow-sm">
                                Select <ChevronDown className="w-3 h-3 text-slate-400" />
                             </button>
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Priority</span>
                        <div className="relative">
                             <button className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors shadow-sm">
                                Select <ChevronDown className="w-3 h-3 text-slate-400" />
                             </button>
                        </div>
                    </div>

                    {/* Sprint */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Sprint</span>
                        <div className="relative">
                             <button className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600">
                                Select Sprint <ChevronDown className="w-3 h-3" />
                             </button>
                        </div>
                    </div>
                    
                    {/* Due Date */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Due Date</span>
                        <div className="relative">
                             <button className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600">
                                Select Date <Calendar className="w-3.5 h-3.5" />
                             </button>
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Estimated Time</span>
                        <div className="relative">
                             <button className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600">
                                Add Estimation <Info className="w-3.5 h-3.5" />
                             </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-3 shrink-0">
             <button 
                onClick={onClose} 
                className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
             >
                Cancel
             </button>
             <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
                Create
             </button>
        </div>
      </div>
    </div>
  );
};
