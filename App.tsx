import React, { useState } from 'react';
import { TopBar } from './components/TopBar';

import { DealsList, DealDetail, ClientProjectDetail, ProjectsList } from './components/ClientViews';
import { MessagesProjectList, MessageHub, MessageBoardDetail, GroupChatView, DirectChatView } from './components/MessagesViews';
import { InternalSidebar } from './components/InternalSidebar';
import { InternalDashboard } from './components/internal/InternalDashboard';
import { InternalProjects } from './components/internal/InternalProjects';
import { InternalTasks } from './components/internal/InternalTasks';
import { InternalReports } from './components/internal/InternalReports';
import { SharedDataProvider, useSharedData } from './context/SharedDataContext';

import { ViewMode, User, Project, TaskStatus, InternalModule } from './types';
import { MOCK_PROJECTS, DEALS, PROJECTS, INVOICES } from './constants'; // Removed USERS
import { USERS } from './data/mockData';

const AppContent = () => {
  const {
    currentUser,
    projects,
    activeProject: contextActiveProject,
    setActiveProject,
    updateTaskStatus,
    switchUser,
    activeProjectId
  } = useSharedData();

  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.CLIENT);

  // --- Client Portal State ---
  const [clientActiveTab, setClientActiveTab] = useState<'deals' | 'projects' | 'messages'>('deals');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedClientProjectId, setSelectedClientProjectId] = useState<string | null>(null);
  const [msgProjectId, setMsgProjectId] = useState<string | null>(null);
  const [msgBoardId, setMsgBoardId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'hub' | 'group' | 'dm'>('hub');
  const [dmUserId, setDmUserId] = useState<string | null>(null);

  // --- Internal Portal State ---
  const [internalModule, setInternalModule] = useState<InternalModule>(InternalModule.DASHBOARD);

  // Sync View Mode with Context User (Optional, or just rely on Context)
  // For prototype, we might want to switch Context User when View Mode changes
  // But SharedDataContext has its own 'switchUser'. 
  // Let's keep it simple: When toggling view, we switch the context user.

  const handleToggleView = (mode: ViewMode) => {
    setCurrentView(mode);
    // Switch Context User based on mode
    if (mode === ViewMode.INTERNAL) {
      switchUser(USERS.MANAGER.id);
    } else {
      switchUser(USERS.CLIENT.id);
    }
  };

  // Derived Active Project for Internal View
  // We use the context's activeProject directly

  // --- Reset Helpers ---
  const handleClientTabChange = (tab: any) => {
    setClientActiveTab(tab);
    setSelectedDealId(null);
    setSelectedClientProjectId(null);
    setMsgProjectId(null);
    setMsgBoardId(null);
    setChatMode('hub');
  };

  const handleInternalModuleChange = (module: InternalModule) => {
    setInternalModule(module);
    setActiveProject(''); // Clear active project in context when switching modules
  };

  const handleSelectInternalProject = (projectId: string) => {
    setActiveProject(projectId);
    setInternalModule(InternalModule.PROJECTS);
  }

  // --- Navigation Helpers ---
  const handleMessageUser = (projectId: string, userId: string) => {
    setMsgProjectId(projectId);
    setDmUserId(userId);
    setChatMode('dm');
    setClientActiveTab('messages');
  };

  // --- Client View Rendering Logic ---
  const renderClientView = () => {
    if (clientActiveTab === 'messages') {
      if (!msgProjectId) return <MessagesProjectList projects={projects} onSelectProject={setMsgProjectId} />;
      const selectedProject = projects.find(p => p.id === msgProjectId);
      if (!selectedProject) return <div>Project not found</div>;
      if (chatMode === 'group') return <GroupChatView onBack={() => setChatMode('hub')} />;
      if (chatMode === 'dm' && dmUserId) return <DirectChatView userId={dmUserId} onBack={() => setChatMode('hub')} />;
      if (msgBoardId) return (<div className="animate-fade-in h-full flex flex-col items-center"><MessageBoardDetail boardId={msgBoardId} onBack={() => setMsgBoardId(null)} /></div>);
      return (
        <div className="animate-fade-in h-[calc(100vh-140px)]">
          <div className="px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedProject.name}</h1>
            <button onClick={() => setMsgProjectId(null)} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">Switch Project</button>
          </div>
          <MessageHub project={selectedProject} onViewBoard={setMsgBoardId} onOpenGroupChat={() => setChatMode('group')} onOpenDirectChat={(uid) => { setDmUserId(uid); setChatMode('dm'); }} />
        </div>
      );
    }

    if (selectedClientProjectId) {
      const project = projects.find(p => p.id === selectedClientProjectId);
      if (!project) return <div>Project not found</div>;
      return (<div className="animate-fade-in pb-10"><div className="px-8 pt-6 pb-2 max-w-[1400px] mx-auto"><button onClick={() => setSelectedClientProjectId(null)} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-fit hover:shadow-md transition-all">← Back to {clientActiveTab === 'projects' ? 'Projects' : 'Deal'}</button></div><ClientProjectDetail project={project} deals={DEALS} onMessageUser={(uid) => handleMessageUser(project.id, uid)} /></div>);
    }

    if (selectedDealId) {
      const deal = DEALS.find(d => d.id === selectedDealId);
      if (!deal) return <div>Deal not found</div>;
      const associatedProject = projects.find(p => p.id === deal.associatedProjectId);
      return (<div className="animate-fade-in pb-10"><div className="px-8 pt-6 pb-2 max-w-[1200px] mx-auto"><button onClick={() => setSelectedDealId(null)} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-fit hover:shadow-md transition-all">← Back to Deals</button></div><DealDetail deal={deal} project={associatedProject} invoices={INVOICES} onViewProject={(pid) => setSelectedClientProjectId(pid)} /></div>);
    }

    // Filter projects for client view - Exclude internal projects (ip1)
    const clientProjects = projects.filter(p => !p.id.startsWith('ip'));

    return (<div className="animate-fade-in pb-10">{clientActiveTab === 'deals' ? (<DealsList deals={DEALS} onViewDeal={setSelectedDealId} />) : (<ProjectsList deals={DEALS} onViewProject={setSelectedClientProjectId} />)}</div>);
  };

  // --- Internal View Rendering Logic ---
  const renderInternalView = () => {
    // If a specific project is selected (activeProject in context), show detail
    // We check if we have an active project AND we are not in dashboard/projects list mode explicitly? 
    // Actually, InternalDashboard calls onSelectProject which sets activeProject.

    // Switch based on active Module
    switch (internalModule) {
      case InternalModule.DASHBOARD:
        return <InternalDashboard projects={projects} onSelectProject={handleSelectInternalProject} />;
      case InternalModule.PROJECTS:
        return <InternalProjects />; // InternalProjects might need connection too, but for now we focus on Dashboard flow
      case InternalModule.TASKS:
        return <InternalTasks />;
      case InternalModule.MESSAGES:
        return <div className="p-10 text-center text-slate-400">Client Messages Module (Placeholder)</div>;
      case InternalModule.CONFIG:
        return <div className="p-10 text-center text-slate-400">System Configuration (Placeholder)</div>;
      default:
        return <InternalReports module={internalModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans text-slate-900">
      <TopBar
        currentView={currentView}
        onToggleView={handleToggleView}
        currentUser={currentUser}
        activeTab={clientActiveTab}
        onTabChange={handleClientTabChange}
      />

      {currentView === ViewMode.CLIENT ? (
        <main className="min-h-[calc(100vh-72px)]">
          {renderClientView()}
        </main>
      ) : (
        <div className="flex">
          <InternalSidebar
            activeModule={internalModule}
            onSelectModule={handleInternalModuleChange}
            currentUser={currentUser}
          />
          <main className="ml-72 flex-1 p-10 h-[calc(100vh-72px)] overflow-y-auto">
            {renderInternalView()}
          </main>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SharedDataProvider>
      <AppContent />
    </SharedDataProvider>
  );
}