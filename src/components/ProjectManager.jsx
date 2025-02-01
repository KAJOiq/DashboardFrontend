import { useState } from 'react';
import { AddProject } from './AddProject';
import { ShowProject } from './ShowProject';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);

 
  const addProject = (project) => {
    setProjects([...projects, { ...project, students: [] }]); 
  };


  const addStudentToProject = (project, studentName) => {
    const updatedProjects = projects.map((p) =>
      p.projectName === project.projectName
        ? { ...p, students: [...p.students, studentName] } 
        : p
    );
    setProjects(updatedProjects);
  };

  return (
    <div>
      <AddProject onAdd={addProject} />
      <ShowProject
        projects={projects}
        onAddStudent={addStudentToProject} 
      />
    </div>
  );
};

export { ProjectManager };
