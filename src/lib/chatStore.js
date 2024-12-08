import {create} from 'zustand'
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./firebase";

export const useChatStore = create((set) => ({
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
    resetChat: () => set({chat: null, participants: []})
}))