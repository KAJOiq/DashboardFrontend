import { useState } from 'react';
import { AddProject } from './AddProject';
import { ShowProject } from './ShowProject';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);

  // Function to add a project
  const addProject = (project) => {
    setProjects([...projects, { ...project, students: [] }]); // Initialize students as an empty array
  };

  // Function to add a student to a project
  const addStudentToProject = (project, studentName) => {
    const updatedProjects = projects.map((p) =>
      p.projectName === project.projectName
        ? { ...p, students: [...p.students, studentName] } // Add student to the project
        : p
    );
    setProjects(updatedProjects);
  };

  return (
    <div>
      <AddProject onAdd={addProject} />
      <ShowProject
        projects={projects}
        onAddStudent={addStudentToProject} // Pass the function correctly here
      />
    </div>
  );
};

export { ProjectManager };
