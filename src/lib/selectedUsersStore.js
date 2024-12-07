import {create} from 'zustand'

export const useSelectedUsersStore = create((set, get) => ({
    selectedUsers: [],
    addUser: (user) => set(state => {
        if (!state.selectedUsers.find((u) => u.id === user.id)) {
            return {selectedUsers: [...state.selectedUsers, user]};
        }
        return state;
    }),
    removeUser: (user) => set(state => ({
        selectedUsers: state.selectedUsers.filter(u => u.id !== user.id)
    })),
    getUserIDs: () => get().selectedUsers.map(user => user.id),
    reset: () => set(() => ({selectedUsers: []})),
}))