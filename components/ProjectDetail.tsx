import React, { useState } from 'react';
import { Project, Task, TaskStatus, ViewMode, Priority, ProjectDocument } from '../types';
import { ArrowLeft, Plus, MoreHorizontal, Bot, CheckCircle2, Clock, Calendar, Eye, EyeOff, Ghost, Users, MessageCircle, FileText, Download, Trash2, X, Shield, Image, UploadCloud } from 'lucide-react';
import { generateProjectSummary } from '../services/geminiService';
import { useSharedData } from '../context/SharedDataContext';
import { ProjectClientRequests } from './internal/projects/tabs/ProjectClientRequests';

interface ProjectDetailProps {
  project: Project;
  viewMode: ViewMode;
  onBack: () => void;
  onUpdateTask: (taskId: string, newStatus: TaskStatus) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project: projectProp, viewMode, onBack, onUpdateTask }) => {
  const { addDocument, updateDocument, deleteDocument, currentUser, projects, addTask, updateClientRequest } = useSharedData();


  // CRITICAL FIX: Use useMemo to derive the fresh project from context
  // This ensures React properly tracks the dependency and re-renders when projects change
  const project = React.useMemo(() => {
    const freshProject = projects.find(p => p.id === projectProp.id);
    console.log('useMemo recalculating project, found:', freshProject);
    console.log('Fresh project documents:', freshProject?.documents);
    return freshProject || projectProp;
  }, [projects, projectProp.id, projectProp]);


  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'requests' | 'documents'>('board');
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);

  // New Document State
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'VAULT' | 'ASSET_LIBRARY'>('VAULT');
  const [newDocType, setNewDocType] = useState<string>('');
  const [newDocLink, setNewDocLink] = useState('');
  const [newDocVisible, setNewDocVisible] = useState(true);
  const [newDocComments, setNewDocComments] = useState('');

  // Task Creation State
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);
  const [linkedRequestId, setLinkedRequestId] = useState<string | null>(null);

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      status: TaskStatus.TODO,
      priority: newTaskPriority,
      isClientVisible: true,
      timeLogs: { internal: 0, billable: 0 },
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week later
      team: [{ user: currentUser, isGhost: false }], // Auto-assign creator
      projectId: project.id
    };

    addTask(project.id, newTask);

    if (linkedRequestId) {
      updateClientRequest(project.id, linkedRequestId, {
        status: 'Converted to Task',
        taskId: newTask.id
      });
      setLinkedRequestId(null);
    }

    setIsCreateTaskOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority(Priority.MEDIUM);
    alert("Task created successfully!");
  };

  // Debug: Log when project changes
  React.useEffect(() => {
    console.log('ProjectDetail re-rendered, project:', project);
    console.log('Project documents:', project.documents);
    console.log('Document count:', project.documents?.length || 0);
  }, [project, project.documents]);

  const handleGenerateSummary = async () => {
    setLoadingAi(true);
    const summary = await generateProjectSummary(project);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const handleUploadDocument = () => {
    console.log('=== UPLOAD DOCUMENT CLICKED ===');
    console.log('Form values:', { newDocName, newDocType, newDocCategory });

    if (!newDocName || !newDocType) {
      console.log('Validation failed - missing required fields');
      alert('Please fill in all required fields');
      return;
    }

    const newDoc: ProjectDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      type: newDocType as any,
      size: '2.4 MB', // Mock size
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      addedBy: currentUser,
      category: newDocCategory,
      isClientVisible: newDocVisible,
      comments: newDocComments,
      url: newDocLink || '#'
    };

    console.log('New document created:', newDoc);
    console.log('Adding to project:', project.id);
    console.log('Current project documents:', project.documents);

    addDocument(project.id, newDoc);

    console.log('Document added to context');
    setIsAddDocOpen(false);

    // Feedback to user
    alert(`Document "${newDocName}" uploaded successfully!`);

    // Reset Form
    setNewDocName('');
    setNewDocCategory('VAULT');
    setNewDocType('');
    setNewDocLink('');
    setNewDocVisible(true);
    setNewDocComments('');
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(project.id, docId);
    }
  };

  const handleToggleVisibility = (doc: ProjectDocument) => {
    updateDocument(project.id, doc.id, { isClientVisible: !doc.isClientVisible });
  };


  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'text-red-600 bg-red-50 border-red-100 ring-red-500/10';
      case Priority.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-100 ring-amber-500/10';
      case Priority.LOW: return 'text-blue-600 bg-blue-50 border-blue-100 ring-blue-500/10';
    }
  };

  const columns = [
    { id: TaskStatus.TODO, title: 'To Do', color: 'bg-slate-100' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-50' },
    { id: TaskStatus.REVIEW, title: 'Review', color: 'bg-amber-50' },
    { id: TaskStatus.DONE, title: 'Done', color: 'bg-emerald-50' },
  ];

  const tasks = project.tasks || [];
  const clientRequests = project.clientRequests || [];

  return (
    <div className="h-full flex flex-col max-w-[1800px] mx-auto w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <button onClick={onBack} className="flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-3 transition-colors uppercase tracking-wide">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              {project.name.substring(0, 1)}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                {project.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500 font-medium">{project.clientName}</span>
                {viewMode === ViewMode.CLIENT && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wide border border-indigo-100">Client View</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerateSummary}
            disabled={loadingAi}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:border-purple-300 hover:text-purple-700 hover:shadow-md transition-all text-sm font-semibold disabled:opacity-70 group"
          >
            <Bot className="w-4 h-4 text-purple-500 group-hover:animate-pulse" />
            {loadingAi ? 'Generating...' : 'AI Report'}
          </button>
          {viewMode === ViewMode.INTERNAL && (
            <button className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all text-sm font-semibold">
              <Plus className="w-4 h-4" /> New Task
            </button>
          )}
        </div>
      </div>

      {/* AI Summary Box */}
      {aiSummary && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5 rounded-2xl flex items-start gap-4 animate-slide-in-down shadow-sm">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-purple-100">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">AI Project Insight</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{aiSummary}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('board')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'board' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}`}
        >
          Internal Board
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'list' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}`}
        >
          Task List
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}`}
        >
          Client Requests
          {clientRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{clientRequests.filter(r => r.status === 'Pending').length}</span>}
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'documents' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}`}
        >
          Documents
        </button>
      </div>

      {/* --- BOARD VIEW --- */}
      {activeTab === 'board' && (
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-6 min-w-max h-full">
            {columns.map(column => {
              const columnTasks = tasks.filter(t => t.status === column.id);
              return (
                <div key={column.id} className="w-80 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${column.id === TaskStatus.DONE ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      {column.title}
                    </h3>
                    <span className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full text-xs font-bold">{columnTasks.length}</span>
                  </div>

                  <div className="bg-slate-50/50 rounded-2xl p-2 flex-1 flex flex-col gap-3 border border-slate-100/50">
                    {columnTasks.map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer relative">
                        {/* Status/Visibility Header */}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ring-1 ring-inset ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <div className="flex items-center gap-2">
                            {/* Client Visibility Toggle Indicator */}
                            {task.isClientVisible ? (
                              <span className="text-emerald-500" title="Visible to Client"><Eye className="w-4 h-4" /></span>
                            ) : (
                              <span className="text-slate-300" title="Internal Only"><EyeOff className="w-4 h-4" /></span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 mb-1.5 leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>

                        {/* Time Logs */}
                        <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2 rounded text-[10px] font-medium text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Int: <span className="text-slate-700 font-bold">{task.timeLogs?.internal || 0}h</span></span>
                          </div>
                          <span className="text-slate-300">|</span>
                          <div>
                            <span>Bill: <span className="text-indigo-600 font-bold">{task.timeLogs?.billable || 0}h</span></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          {/* Assignees & Ghosts */}
                          <div className="flex -space-x-2">
                            {task.team ? task.team.map((member, idx) => (
                              <div key={idx} className="relative group/avatar">
                                <img
                                  src={member.user.avatar || "https://i.pravatar.cc/150"}
                                  alt={member.user.name}
                                  className={`w-6 h-6 rounded-full border border-white shadow-sm ${member.isGhost ? 'opacity-50 grayscale ring-2 ring-slate-200' : ''}`}
                                />
                                {member.isGhost && (
                                  <div className="absolute -top-1 -right-1 bg-slate-800 text-white rounded-full p-[1px]">
                                    <Ghost className="w-2 h-2" />
                                  </div>
                                )}
                              </div>
                            )) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] text-slate-400 font-bold">?</div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CLIENT REQUESTS TAB --- */}
      {activeTab === 'requests' && (
        <ProjectClientRequests
          project={project}
          onRequestConvert={(req) => {
            setNewTaskTitle(req.title);
            setNewTaskDesc(req.description);
            setLinkedRequestId(req.id);
            setIsCreateTaskOpen(true);
          }}
        />
      )}

      {/* --- DOCUMENTS TAB --- */}
      {activeTab === 'documents' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">Documents</h3>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{project.documents?.length || 0} Documents</span>
              </div>
              <button
                onClick={() => setIsAddDocOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4" /> Add Document
              </button>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-16">No.</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Visiblity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Comments</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Added By</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {project.documents && project.documents.length > 0 ? (
                    project.documents.map((doc, index) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="min-w-[32px] w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800 hover:text-indigo-600 cursor-pointer">{doc.name}</div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide">{doc.size || 'Unknown Size'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleVisibility(doc)}
                            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded w-fit border transition-all ${doc.isClientVisible ? 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100' : 'text-slate-500 bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
                          >
                            {doc.isClientVisible ? (
                              <> <Eye className="w-3 h-3" /> Client </>
                            ) : (
                              <> <EyeOff className="w-3 h-3" /> Internal </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                          {doc.comments || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <img src={doc.addedBy.avatar} alt={doc.addedBy.name} className="w-6 h-6 rounded-full border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700">{doc.addedBy.name}</span>
                              <span className="text-[10px] text-slate-400">{doc.uploadedAt}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/30">
                        No documents found. Click "Add Document" to upload.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
      }

      {/* --- ADD DOCUMENT SLIDE-OVER --- */}
      {
        isAddDocOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsAddDocOpen(false)}></div>
            <div className="relative w-[400px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
              <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">Add Document</h3>
                <button onClick={() => setIsAddDocOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-100 p-1 rounded-full border border-slate-200 shadow-sm"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Document Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    placeholder="e.g. Service Agreement v2"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setNewDocCategory('VAULT')}
                      className={`px-4 py-3 border-2 rounded-xl text-sm font-bold flex flex-col items-center gap-2 transition-all shadow-sm ${newDocCategory === 'VAULT' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Shield className="w-5 h-5" />
                      Vault
                    </button>
                    <button
                      onClick={() => setNewDocCategory('ASSET_LIBRARY')}
                      className={`px-4 py-3 border-2 rounded-xl text-sm font-bold flex flex-col items-center gap-2 transition-all shadow-sm ${newDocCategory === 'ASSET_LIBRARY' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Image className="w-5 h-5" />
                      Asset Library
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    <strong>Vault:</strong> Contracts, Invoices, specs (List View). <br />
                    <strong>Asset Library:</strong> Logos, designs, media (Grid View).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Document Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                  >
                    <option value="">Select Type...</option>
                    <option value="CONTRACT">Contract / Agreement</option>
                    <option value="INVOICE">Invoice</option>
                    <option value="TECHNICAL">Technical Spec</option>
                    <option value="REPORT">Report / Audit</option>
                    <option value="DESIGN">Design File</option>
                    <option value="BRANDING">Branding Asset</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Upload File (Optional - Simulated)</label>
                  <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                    <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-xs font-medium group-hover:text-indigo-600">File upload simulated - just fill name & type</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">External Link (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    placeholder="https://"
                    value={newDocLink}
                    onChange={(e) => setNewDocLink(e.target.value)}
                  />
                </div>

                <div className={`border rounded-lg p-4 flex items-start gap-3 transition-colors ${newDocVisible ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      checked={newDocVisible}
                      onChange={(e) => setNewDocVisible(e.target.checked)}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Visible to Client</span>
                    <span className="block text-xs text-slate-500 mt-0.5">If unchecked, this file will only be visible to internal team members.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Comments</label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all h-24 resize-none"
                    placeholder="Add optional comments..."
                    value={newDocComments}
                    onChange={(e) => setNewDocComments(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <button onClick={() => setIsAddDocOpen(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
                <button
                  onClick={handleUploadDocument}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                >
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        )
      }
      {/* --- CREATE TASK MODAL --- */}
      {isCreateTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {linkedRequestId ? 'Convert Request to Task' : 'Create New Task'}
                </h3>
                {linkedRequestId && <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Linked to Request #{linkedRequestId}</span>}
              </div>
              <button onClick={() => setIsCreateTaskOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Task Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 font-bold text-slate-800"
                  placeholder="e.g. Implement Login Page"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 h-32 resize-none"
                  placeholder="Add task details..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                  >
                    <option value={Priority.LOW}>Low</option>
                    <option value={Priority.MEDIUM}>Medium</option>
                    <option value={Priority.HIGH}>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Assignee</label>
                  <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 flex items-center gap-2">
                    <img src={currentUser.avatar} alt="Me" className="w-5 h-5 rounded-full" />
                    <span>{currentUser.name} (Me)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setIsCreateTaskOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};