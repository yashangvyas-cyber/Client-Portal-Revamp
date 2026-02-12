import React, { useState } from 'react';
import { Project, ProjectDocument } from '../../../../types';
import { Plus, FileText, Download, Trash2, Eye, EyeOff, X, Shield, Image, UploadCloud } from 'lucide-react';
import { useSharedData } from '../../../../context/SharedDataContext';

interface ProjectDocumentsProps {
    project: Project;
}

export const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ project }) => {
    const { addDocument, updateDocument, deleteDocument, currentUser } = useSharedData();
    const [isAddDocOpen, setIsAddDocOpen] = useState(false);

    // New Document State
    const [newDocName, setNewDocName] = useState('');
    // Category defaults to VAULT, no selection in UI
    const [newDocType, setNewDocType] = useState<string>('');
    const [newDocLink, setNewDocLink] = useState('');
    const [newDocVisible, setNewDocVisible] = useState(true);
    const [newDocComments, setNewDocComments] = useState('');

    const handleUploadDocument = () => {
        // Basic validation
        if (!newDocName || !newDocType) {
            alert('Please fill in all required fields (Name and Type).');
            return;
        }

        // SIMULATION: If no actual file/link is provided, we simulate a file upload
        // In a real app, we would upload the 'file' state here.
        const effectiveUrl = newDocLink || '#';
        const effectiveSize = '1.2 MB'; // Simulated size for the "uploaded" file

        const newDoc: ProjectDocument = {
            id: `doc-${Date.now()}`,
            name: newDocName,
            type: newDocType as any,
            size: effectiveSize,
            uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            addedBy: currentUser,
            category: 'VAULT', // Always default to VAULT as requested
            isClientVisible: newDocVisible,
            comments: newDocComments,
            url: effectiveUrl
        };

        addDocument(project.id, newDoc);
        setIsAddDocOpen(false);

        // Reset Form
        setNewDocName('');
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

    return (
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
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Visibility</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Comments</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Added By</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {project.documents?.map((doc, index) => (
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
                            ))}
                            {(!project.documents || project.documents.length === 0) && (
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

            {/* --- ADD DOCUMENT SLIDE-OVER --- */}
            {isAddDocOpen && (
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

                            {/* Category Selection Removed - Defaults to Vault internally */}

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
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Upload File <span className="text-red-500">*</span></label>
                                <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                                    <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                    <span className="text-xs font-medium group-hover:text-indigo-600">Click to upload or drag and drop</span>
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
            )}
        </div>
    );
};
