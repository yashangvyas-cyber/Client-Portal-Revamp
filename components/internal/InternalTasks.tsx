import React, { useState } from 'react';
import { PROJECTS } from '../../constants';
import { TaskProjectList } from './tasks/TaskProjectList';
import { TaskBoard } from './tasks/TaskBoard';

export const InternalTasks: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const activeProject = PROJECTS.find(p => p.id === selectedProjectId);

  if (activeProject) {
    return (
      <TaskBoard 
        project={activeProject} 
        onBack={() => setSelectedProjectId(null)} 
      />
    );
  }

  return (
    <TaskProjectList 
      projects={PROJECTS} 
      onSelectProject={setSelectedProjectId} 
    />
  );
};