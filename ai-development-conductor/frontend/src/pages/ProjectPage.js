import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Project: {id}</h1>
      <p>Project details will be displayed here.</p>
    </div>
  );
};

export default ProjectPage;
