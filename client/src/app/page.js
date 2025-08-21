"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileIcon,
  Loader2,
  Paperclip,
  Send,
  Sidebar as SidebarIcon,
  X,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useConversationStore } from "@/store/conversation-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  createMessage,
  getResponseAndUpdateMessage,
  updateConversation,
} from "@/services/api";

export default function ChatUI() {
  const { messages, addMessage, updateMessageResponse } =
    useConversationStore();
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();
  const convRef = useRef(null);

  const { mutate: updateConversationMsgTime } = useMutation({
    mutationFn: updateConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  const { mutate: getResponse, isPending: isGettingResponse } = useMutation({
    mutationFn: getResponseAndUpdateMessage,
    onSuccess: (data) => {
      updateMessageResponse(data);
      updateConversationMsgTime({
        lastMessageTime: data?.createdAt,
        id: selectedChat?._id,
      });
    },
  });

  const { mutate: createMessageMutate, isPending: isMessageCreating } =
    useMutation({
      mutationFn: createMessage,
      onSuccess: (data) => {
        setMessage("");
        setFile(null);
        addMessage(data);
        getResponse(data?._id);
      },
    });

  const { mutate: createConvo, isPending: isCreatingConvo } = useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      setSelectedChat(data?.conversation);
      setMessage("");
      setFile(null);
      addMessage(data?.message);
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      getResponse(data?.message?._id);
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("query", message);
    if (file) formData.append("file", file);

    if (!selectedChat) {
      createConvo(formData);
    } else {
      formData.append("conversationId", selectedChat._id);
      createMessageMutate(formData);
    }
  };

  useEffect(() => {
    if (convRef.current) {
      convRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <SidebarIcon size={20} />
          </button>
          <h1 className="text-lg font-medium text-gray-900">AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages?.map((msg, i) => (
              <div key={msg._id} className="flex gap-4 w-full">
                <div className="flex-1 space-y-4 flex flex-col w-full">
                  <div className="ml-auto flex flex-col items-end gap-2">
                    {msg?.file && (
                      <div className="border-2 border-blue-400 w-fit flex gap-2 items-center p-2 rounded-lg text-sm">
                        <FileIcon className="text-blue-500" />
                        <p>{msg?.file?.filename}</p>
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-900 bg-stone-200 px-3 py-2 rounded-lg">
                      {msg?.query}
                    </div>
                  </div>
                  {isGettingResponse && i === messages.length - 1 ? (
                    <div className="size-4 bg-stone-700 rounded-full animate-pulse" />
                  ) : (
                    <div className="text-gray-700 mr-auto">{msg?.response}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={convRef} />
          </div>
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSendMessage}
              className="flex gap-3 items-center"
            >
              <label htmlFor="file">
                <input
                  id="file"
                  type="file"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Paperclip className="cursor-pointer" />
              </label>
              <div className="w-full px-4 py-3 space-y-3 border border-gray-300 rounded-lg  peer-focus:ring-2  focus:ring-blue-500 focus:border-transparent">
                {file && (
                  <div className="border-2 border-blue-400 w-fit flex gap-2 items-center p-2 rounded-lg">
                    <FileIcon className="text-blue-500" />
                    <p>{file?.name}</p>
                    <X
                      size={15}
                      className="ml-3 cursor-pointer"
                      onClick={() => setFile(null)}
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 focus:outline-none w-full"
                />
              </div>
              <button
                type="submit"
                disabled={
                  !message.trim() || isMessageCreating || isCreatingConvo
                }
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isCreatingConvo || isMessageCreating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
