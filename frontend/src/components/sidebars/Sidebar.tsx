import { UserButton, useUser } from "@clerk/clerk-react";
import { PanelLeftClose, BadgePlus, MoreHorizontal, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import CollapsedSidebar from "./CollapsedSidebar";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Chat {
  id: string;
  title: string | null;
}

export default function Sidebar() {
  const { user } = useUser();
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userBtnRef = useRef<HTMLDivElement>(null);

  const openClerkMenu = () => {
    const internalBtn = userBtnRef.current?.querySelector("button");
    internalBtn?.click();
  };

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chats: Chat[] = [
    { id: "1", title: "Project Ideas" },
    { id: "2", title: "Team Chat" },
    { id: "3", title: "Random Thoughts" },
    { id: "4", title: "AI Experiments" },
  ];

  const createChat = () => alert("Create new chat clicked");

  const selectChat = (id: string) => {
    console.log(`Selected chat ${id}`);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirm = window.confirm("Are you sure you want to delete this chat?");
    if (confirm) {
      alert(`Deleted chat ${id}`);
      setActiveMenuId(null);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const activeChatId = "1";

  if (collapsed) return <CollapsedSidebar setCollapsed={setCollapsed} />;

  return (
    <aside className="fixed md:relative h-dvh w-64 bg-white border-r border-secondary flex flex-col z-30">
      <div className="px-4 py-3 flex items-center justify-between border-secondary">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <img src="./logo.png" alt="logo" className="h-6 w-6" />
            <h2 className="text-md font-semibold text-primary">Chatty-AI</h2>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition"
          title="Collapse sidebar"
        >
          <PanelLeftClose strokeWidth={2.5} size={16} className="text-primary opacity-85" />
        </button>
      </div>

      <div className="px-3 pt-3 pb-2 border-b border-gray-100">
        <button
          onClick={createChat}
          className="w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <BadgePlus strokeWidth={2} size={16} />
          New chat
        </button>
      </div>

      {/* CHAT LIST */}
      <nav className="px-3 pt-3 pb-3 overflow-y-auto grow min-h-0 space-y-1">
        {chats.map((chat) => {
          const isActive = chat.id === activeChatId;
          const isMenuOpen = activeMenuId === chat.id;

          return (
            <div
              key={chat.id}
              className={`relative group flex items-center rounded-lg transition-colors ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <button onClick={() => selectChat(chat.id)} className="grow text-left px-3 py-2 text-xs truncate pr-8">
                <span className={`font-medium ${isActive ? "text-primary" : "text-primary opacity-90"}`}>{chat.title || "Untitled Chat"}</span>
              </button>

              <button
                onClick={(e) => toggleMenu(e, chat.id)}
                className={`absolute right-2 p-1 rounded-md transition-opacity ${
                  isMenuOpen || isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } hover:bg-gray-200 text-primary `}
              >
                <MoreHorizontal size={16} />
              </button>

              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-9 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden py-1 px-0.5"
                >
                  <button
                    onClick={(e) => deleteChat(e, chat.id)}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div
        onClick={openClerkMenu}
        className="border-t border-gray-100 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{user?.fullName ?? user?.username ?? "User"}</div>
        <div className="flex" ref={userBtnRef}>
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
