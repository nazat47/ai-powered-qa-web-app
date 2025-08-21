import { create } from "zustand";

export const useConversationStore = create((set, get) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set({ messages: [...get().messages, message] }),
  updateMessageResponse: (message) =>
    set({
      messages: get().messages?.map((msg) =>
        msg._id === message?._id ? message : msg
      ),
    }),
  clearMessages: () => set({ messages: [] }),
}));
