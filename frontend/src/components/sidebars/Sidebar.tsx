import { UserButton, useUser } from "@clerk/clerk-react";
import { PanelLeftClose, BadgePlus } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import CollapsedSidebar from "./CollapsedSidebar";

export default function Sidebar() {
  const { user } = useUser();
  
  const [collapsed, setCollapsed] = useState(false);
  const userBtnRef = useRef<HTMLDivElement>(null);
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const openClerkMenu = () => {
    const internalBtn = userBtnRef.current?.querySelector("button");
    internalBtn?.click();
  };

  useEffect(()=> {
    if(isMobile)
    setCollapsed(true)
  }, [isMobile])

  // Hardcoded chats
  const chats = [
    { id: "1", title: "Project Ideas", snippet: "Discuss ideas for hackathon..." },
    { id: "2", title: "Team Chat", snippet: "Who is online now?" },
    { id: "3", title: "Random Thoughts", snippet: "Share your random thoughts..." },
    { id: "4", title: "AI Experiments", snippet: "Testing GPT-5 features..." },
  ];

  const createChat = () => alert("Create new chat clicked");
  const selectChat = (id: string) => alert(`Selected chat ${id}`);
  const activeChatId = "1";

  if (collapsed) return <CollapsedSidebar setCollapsed={setCollapsed} />;

  return (
    <aside className="fixed md:relative h-dvh w-54 bg-white border-r border-secondary flex flex-col">
      {/* HEADER */}
      <div className="px-4 py-3 flex items-center justify-between border-secondary">
        <div className="flex items-center gap-1">
          <img src="./logo.png" alt="logo" className="h-6 w-6" />
          <h2 className="text-md font-semibold text-primary">Chatty-AI</h2>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#e9e9e980] transition"
          title="Collapse sidebar"
        >
          <PanelLeftClose strokeWidth={2.5} size={16} className="text-primary opacity-70" />
        </button>
      </div>

      {/* NEW CHAT */}
      <div className="px-3 pt-3 pb-2 border-b border-secondary">
        <button
          onClick={createChat}
          className="w-full px-3 py-2 rounded-lg hover:bg-[#e9e9e980] transition flex items-center gap-2 text-xs font-medium text-primary"
        >
          <BadgePlus strokeWidth={2} size={16} />
          New chat
        </button>
      </div>

      {/* CHAT LIST */}
      <nav className="px-3 pt-3 pb-3 overflow-y-auto grow min-h-0">
        {chats.map((chat) => {
          const isActive = chat.id === activeChatId;
          return (
            <button
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`w-full text-left px-3 py-2 my-1 rounded-lg text-xs transition ${
                isActive
                  ? "bg-primary text-primary"
                  : "hover:bg-[#e9e9e980] text-primary"
              }`}
            >
              <div className="font-medium truncate">{chat.title}</div>
              <div className="text-[10px] text-primary truncate mt-0.5">{chat.snippet}</div>
            </button>
          );
        })}
      </nav>

      <div
        onClick={openClerkMenu}
        className="border-t border-secondary px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#e9e9e980] transition"
      >
        <div className="text-sm font-medium text-primary truncate">
          {user?.fullName ?? user?.username ?? "User"}
        </div>
        <div className="flex" ref={userBtnRef}>
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
