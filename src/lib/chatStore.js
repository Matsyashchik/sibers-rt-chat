import {create} from 'zustand'
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./firebase";

export const useChatStore = create((set, get) => ({
    chat: null,
    participants: null,
    changeChat: async (chat) => {
        const participants = [];
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("id", "in", chat.participants));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                participants.push(doc.data());
            });
        } catch (e) {
            console.log(e)
        }

        set({chat: chat, participants: participants})
    },
    resetChat: () => set({chat: null, participants: null}),
    removeUser: (user) => set(state => ({
        participants: state.participants.filter(u => u.id !== user.id), ...state
    })),
    getMembers: (state) => get().participants.filter(u => u.id !== state.chat?.creator),
}))