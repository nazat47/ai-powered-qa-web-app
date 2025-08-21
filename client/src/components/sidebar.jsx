import { getMessages, getUserConversations } from "@/services/api";
import { useConversationStore } from "@/store/conversation-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";

const Sidebar = ({ sidebarOpen, selectedChat, setSelectedChat }) => {
  const { setMessages } = useConversationStore();
  const { clearMessages } = useConversationStore();
  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: getMessages,
    onSuccess: (data) => {
      setMessages(data);
    },
  });

  const handleConversationClick = (conv) => {
    setSelectedChat(conv);
    mutate(conv?._id);
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-0"
      } transition-all duration-300 overflow-hidden bg-gray-50 border-r border-gray-200 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => {
            clearMessages();
            setSelectedChat(null);
          }}
          className="w-fit flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {data?.map((conv) => (
          <button
            key={conv._id}
            onClick={() => handleConversationClick(conv)}
            className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
              selectedChat?._id === conv?._id
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium text-sm text-gray-900 truncate">
              {conv?.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
