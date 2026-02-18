import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task, WorkLog, User, ProjectType, ClientRequest, ProjectDocument } from '../types';
import { PROJECTS, TASKS, USERS, LOGS } from '../data/mockData';

interface SharedDataState {
    currentUser: User;
    projects: Project[];
    tasks: Task[];
    logs: WorkLog[];
    activeProject: Project | null;
    activeProjectId?: string | null;
}

interface SharedDataActions {
    switchUser: (userId: string) => void;
    setActiveProject: (projectId: string) => void;
    updateTaskStatus: (taskId: string, status: string) => void;
    addTimeLog: (taskId: string, hours: number, description: string) => void;
    addClientRequest: (projectId: string, request: ClientRequest) => void;
    addDocument: (projectId: string, document: ProjectDocument) => void;
    updateDocument: (projectId: string, documentId: string, updates: Partial<ProjectDocument>) => void;
    deleteDocument: (projectId: string, documentId: string) => void;
    updateClientRequest: (projectId: string, requestId: string, updates: Partial<ClientRequest>) => void;
    deleteClientRequest: (projectId: string, requestId: string) => void;
    addTask: (projectId: string, task: Task) => void;
}

const SharedDataContext = createContext<(SharedDataState & SharedDataActions) | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State ---
    const [currentUser, setCurrentUser] = useState<User>(USERS.CLIENT);

    // Initialize from LocalStorage or Fallback to Mock Data
    const [projects, setProjects] = useState<Project[]>(() => {
        const saved = localStorage.getItem('collabcrm_projects');
        return saved ? JSON.parse(saved) : PROJECTS;
    });

    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('collabcrm_tasks');
        return saved ? JSON.parse(saved) : TASKS;
    });

    const [logs, setLogs] = useState<WorkLog[]>(LOGS); // Realtime logs don't need persistence for this demo

    // CHANGED: Store ID instead of object to ensure reactivity
    const [activeProjectId, setActiveProjectId] = useState<string | null>(PROJECTS[0]?.id || null);

    // Derived State
    const activeProject = projects.find(p => p.id === activeProjectId) || null;

    // --- Persistence Effects ---
    useEffect(() => {
        localStorage.setItem('collabcrm_projects', JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        localStorage.setItem('collabcrm_tasks', JSON.stringify(tasks));
    }, [tasks]);


    // --- Actions ---

    const switchUser = (userId: string) => {
        const user = Object.values(USERS).find(u => u.id === userId);
        if (user) setCurrentUser(user);
    };

    const setActiveProject = (projectId: string) => {
        setActiveProjectId(projectId);
    };

    const updateTaskStatus = (taskId: string, status: string) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: status as any } : t
        ));
        // Also update project progress if needed (mock logic)
        if (activeProject) {
            const projectTasks = tasks.filter(t => activeProject.tasks?.some(pt => pt.id === t.id));
            const doneCount = projectTasks.filter(t => t.status === 'DONE').length;
            const newProgress = Math.round((doneCount / projectTasks.length) * 100) || 0;

            setProjects(prev => prev.map(p =>
                p.id === activeProject.id ? { ...p, progress: newProgress } : p
            ));
        }
    };

    const addTimeLog = (taskId: string, hours: number, description: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newLog: WorkLog = {
            id: `log-${Date.now()}`,
            taskId,
            taskTitle: task.title,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            date: new Date().toISOString().split('T')[0],
            hours: hours,
            billedHours: hours, // Default to 1:1 for now
            description,
            isClientVisible: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setLogs(prev => [newLog, ...prev]);

        // Update Task Totals
        setTasks(prev => prev.map(t =>
            t.id === taskId ? {
                ...t,
                timeLogs: {
                    internal: t.timeLogs.internal + hours,
                    billable: t.timeLogs.billable + hours
                }
            } : t
        ));
    };

    const addClientRequest = (projectId: string, request: ClientRequest) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const updatedRequests = p.clientRequests ? [request, ...p.clientRequests] : [request];
                return { ...p, clientRequests: updatedRequests };
            }
            return p;
        }));
    };

    const addDocument = (projectId: string, document: ProjectDocument) => {
        console.log('SharedDataContext.addDocument called:', { projectId, document });
        console.log('Current projects before update:', projects);

        setProjects(prev => {
            console.log('setProjects callback executing, prev:', prev);
            const updated = prev.map(p => {
                if (p.id === projectId) {
                    const updatedDocs = p.documents ? [document, ...p.documents] : [document];
                    console.log(`Updating project ${projectId}, old docs:`, p.documents, 'new docs:', updatedDocs);
                    return { ...p, documents: updatedDocs };
                }
                return p;
            });
            console.log('Updated projects:', updated);
            return updated;
        });
    };

    const updateDocument = (projectId: string, documentId: string, updates: Partial<ProjectDocument>) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId && p.documents) {
                const updatedDocs = p.documents.map(d =>
                    d.id === documentId ? { ...d, ...updates } : d
                );
                return { ...p, documents: updatedDocs };
            }
            return p;
        }));
    };

    const deleteDocument = (projectId: string, documentId: string) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId && p.documents) {
                const updatedDocs = p.documents.filter(d => d.id !== documentId);
                return { ...p, documents: updatedDocs };
            }
            return p;
        }));
    };

    const updateClientRequest = (projectId: string, requestId: string, updates: Partial<ClientRequest>) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId && p.clientRequests) {
                const updatedRequests = p.clientRequests.map(r =>
                    r.id === requestId ? { ...r, ...updates } : r
                );
                return { ...p, clientRequests: updatedRequests };
            }
            return p;
        }));
    };

    const deleteClientRequest = (projectId: string, requestId: string) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId && p.clientRequests) {
                const updatedRequests = p.clientRequests.filter(r => r.id !== requestId);
                return { ...p, clientRequests: updatedRequests };
            }
            return p;
        }));
    };

    const addTask = (projectId: string, task: Task) => {
        // Update flattened tasks
        setTasks(prev => [task, ...prev]);

        // Update project tasks
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks ? [task, ...p.tasks] : [task];
                return { ...p, tasks: updatedTasks };
            }
            return p;
        }));
    };

    return (
        <SharedDataContext.Provider value={{
            currentUser,
            projects,
            tasks,
            logs,
            activeProject,
            activeProjectId,
            switchUser,
            setActiveProject,
            updateTaskStatus,
            addTimeLog,
            addClientRequest,
            addDocument,
            updateDocument,
            deleteDocument,
            updateClientRequest,
            deleteClientRequest,
            addTask
        }}>
            {children}
        </SharedDataContext.Provider>
    );
};

export const useSharedData = () => {
    const context = useContext(SharedDataContext);
    if (context === undefined) {
        throw new Error('useSharedData must be used within a SharedDataProvider');
    }
    return context;
};
