import {create} from 'zustand'

export const useChatStore = create((set) => ({
    chatId: null,
    changeChat: (chatId) => {
        return set(
            chatId,
        )
    }
}))