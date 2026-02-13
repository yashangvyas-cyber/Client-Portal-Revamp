import React, { useState } from 'react';
import { useSharedData } from '../../context/SharedDataContext';
import { TaskProjectList } from './tasks/TaskProjectList';
import { TaskBoard } from './tasks/TaskBoard';

export const InternalTasks: React.FC = () => {
  const { projects } = useSharedData();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Derive active project from context data, ensuring reactivity
  const activeProject = projects.find(p => p.id === selectedProjectId);

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
      projects={projects}
      onSelectProject={setSelectedProjectId}
    />
  );
};