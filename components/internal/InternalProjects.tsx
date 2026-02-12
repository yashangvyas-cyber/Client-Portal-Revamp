import React, { useState } from 'react';
import { useSharedData } from '../../context/SharedDataContext';
import { ProjectList } from './projects/ProjectList';
import { ProjectDetailsWrapper } from './projects/ProjectDetailsWrapper';

export const InternalProjects: React.FC = () => {
  const { projects } = useSharedData();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (selectedProject) {
    return (
      <ProjectDetailsWrapper
        project={selectedProject}
        onBack={() => setSelectedProjectId(null)}
      />
    );
  }

  return (
    <ProjectList
      projects={projects}
      onSelectProject={setSelectedProjectId}
    />
  );
};