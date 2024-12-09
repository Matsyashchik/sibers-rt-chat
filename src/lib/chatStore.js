import {create} from 'zustand'
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./firebase";

export const useChannelStore = create((set, get) => ({
    channel: null,
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

        set({channel: chat, participants: participants})
    },
    resetChat: () => set({channel: null, participants: null}),
    removeUser: (user) => set(state => ({
        participants: state.participants.filter(u => u.id !== user.id)
    })),
    getMembers: (state) => get().participants.filter(u => u.id !== state.channel?.creator),
}))