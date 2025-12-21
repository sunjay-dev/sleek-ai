import { UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { PanelLeftClose, BadgePlus, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CollapsedSidebar from "./CollapsedSidebar";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Chat } from "@/types";

type Props = {
  onDeleteRequest: (chatId: string) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
};

export default function Sidebar({ chats, setChats, onDeleteRequest }: Props) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const userBtnRef = useRef<HTMLDivElement>(null);

  const openClerkMenu = () => {
    const btn = userBtnRef.current?.querySelector("button");
    btn?.click();
  };

  useEffect(() => {
    setLoading(true);

    getToken()
      .then((token) => {
        if (!token) return;

        return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res?.ok) throw new Error("Failed to fetch chats");
        return res.json();
      })
      .then((data) => {
        if (data) setChats(data);
      })
      .catch((err) => console.error("failed to fetch chats", err))
      .finally(() => setLoading(false));
  }, [getToken, setChats]);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  const createChat = () => {
    navigate("/");
    if (isMobile) setCollapsed(true);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) setCollapsed(true);
  };

  if (collapsed) return <CollapsedSidebar setCollapsed={setCollapsed} createNewChat={createChat} />;

  return (
    <aside className="fixed md:relative h-dvh w-64 bg-white border-r border-secondary flex flex-col z-30 shrink-0">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="h-6 w-6" />
          <span className="font-semibold text-sm">Chatty-AI</span>
        </div>
        <button onClick={() => setCollapsed(true)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="px-3 pb-2 border-b border-secondary">
        <button onClick={createChat} className="w-full px-3 py-2 text-sm flex items-center gap-2 rounded-lg hover:bg-gray-100">
          <BadgePlus size={16} />
          New chat
        </button>
      </div>

      <nav className="px-3 py-2 overflow-y-auto grow space-y-1">
        {loading && <div className="text-xs text-gray-400 text-center py-4">Loading chats…</div>}

        {!loading && chats.length === 0 && <div className="text-xs text-gray-400 text-center py-4">No chats yet</div>}

        {chats.map((chat) => {
          const isMenuOpen = openMenuId === chat.id;

          return (
            <NavLink
              key={chat.id}
              to={`/c/${chat.id}`}
              onClick={() => {
                setOpenMenuId(null);
                closeSidebarOnMobile();
              }}
              className={({ isActive }) =>
                [
                  "group relative flex items-center justify-between px-3 py-1.5 rounded-lg text-xs",
                  "hover:bg-gray-50",
                  isActive ? "font-medium bg-gray-100" : "",
                ].join(" ")
              }
            >
              <span className="flex-1 truncate">{chat.title || "Untitled chat"}</span>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenMenuId(isMenuOpen ? null : chat.id);
                }}
                className={[
                  "p-1 rounded-md hover:bg-gray-200 transition",
                  isMenuOpen || isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                ].join(" ")}
                aria-label="Open chat menu"
              >
                <MoreHorizontal size={16} />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-3 top-full mt-1 w-32 bg-white border border-secondary shadow-lg rounded-md z-50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      onDeleteRequest(chat.id);
                    }}
                    className="w-full px-3 py-2 text-xs text-red-600 flex items-center gap-2 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div
        onClick={openClerkMenu}
        className="border-t border-secondary px-4 py-3 flex items-center justify-between mt-auto hover:bg-gray-50 cursor-pointer"
      >
        <span className="text-sm truncate max-w-[140px]">{user?.fullName ?? user?.username ?? "User"}</span>

        <div ref={userBtnRef}>
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
