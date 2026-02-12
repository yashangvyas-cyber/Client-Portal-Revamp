import React, { useState } from 'react';
import { useSharedData } from '../../context/SharedDataContext';
import { MessageHub, MessageBoardDetail, GroupChatView, DirectChatView, MessagesProjectList } from '../MessagesViews';

export const ClientMessages = () => {
    const { projects, activeProject } = useSharedData();
    // Default to the first project or the active one
    const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProject?.id || projects[0]?.id);

    // View State: 'hub', 'board', 'group', 'direct'
    const [view, setView] = useState<'hub' | 'board' | 'group' | 'direct'>('hub');
    const [detailId, setDetailId] = useState<string | null>(null); // For board or user ID

    const project = projects.find(p => p.id === selectedProjectId) || projects[0];

    const handleViewBoard = (boardId: string) => {
        setDetailId(boardId);
        setView('board');
    };

    const handleOpenGroupChat = () => {
        setView('group');
    };

    const handleOpenDirectChat = (userId: string) => {
        setDetailId(userId);
        setView('direct');
    };

    const handleBackToHub = () => {
        setDetailId(null);
        setView('hub');
    };

    if (!project) return <div>No projects found</div>;

    return (
        <div className="animate-fade-in h-[calc(100vh-140px)]">
            {view === 'hub' && (
                <MessageHub
                    project={project}
                    onViewBoard={handleViewBoard}
                    onOpenGroupChat={handleOpenGroupChat}
                    onOpenDirectChat={handleOpenDirectChat}
                />
            )}

            {view === 'board' && detailId && (
                <MessageBoardDetail boardId={detailId} onBack={handleBackToHub} />
            )}

            {view === 'group' && (
                <GroupChatView onBack={handleBackToHub} />
            )}

            {view === 'direct' && detailId && (
                <DirectChatView userId={detailId} onBack={handleBackToHub} />
            )}
        </div>
    );
};
