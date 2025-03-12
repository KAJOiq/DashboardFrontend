import { create } from 'zustand';

const useAppStore = create((set) => ({
  roles: [
    { id: 1, name: 'Supervisor' },
    { id: 2, name: 'Student' },
  ],

  users: [],

  token: localStorage.getItem('token') || null,

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  fetchUsers: async () => {
    try {
      const response = await fetch('http://localhost:5091/api/account/all-users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();

      const formattedUsers = data.map((user) => ({
        id: user.id,
        username: user.userName,
        email: user.email,
        phone: user.phoneNumber || 'N/A',
        sex: user.sex,
        dob: user.dob.split('T')[0],
        role: user.roles[0] || 'N/A',
      }));

      set({ users: formattedUsers });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ users: [] });
    }
  },

  setToken: (token) => {
    localStorage.setItem('token', token); 
    set({ token });
  },

  clearToken: () => {
    localStorage.removeItem('token'); 
    set({ token: null });
  },
}));

export default useAppStore;