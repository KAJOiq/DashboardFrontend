import { create } from 'zustand';

const useProjectStore = create((set) => ({
  projects: [], 
  setProjects: (projects) => set({ projects }), 
  fetchProjects: async (currentPage = 1, pageSize = 10) => {
    try {
      const response = await fetch(`http://localhost:5091/api/project?CurrentPage=${currentPage}&PageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();

      const projects = data.items || [];

      set({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ projects: [] }); 
    }
  },
}));

export default useProjectStore;
