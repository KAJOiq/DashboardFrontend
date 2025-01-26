import { create } from 'zustand';

const useAppStore = create((set) => ({
  roles: [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Viewer' },
  ],
  users: [
    {
      id: 1,
      username: 'John Doe',
      email: 'admin@1.com',
      phone: '1234',
      sex: 'male',
      dob: '1990-01-01',
      role: 'Admin',
    },
  ],
  setRoles: (roles) => set({ roles }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, { id: state.users.length + 1, ...user }],
    })),
}));

export default useAppStore;
