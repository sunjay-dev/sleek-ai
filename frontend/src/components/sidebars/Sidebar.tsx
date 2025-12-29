import { UserButton, useUser } from "@clerk/clerk-react";
import { BadgePlus, MoreHorizontal, Trash2, Settings, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CollapsedSidebar from "./CollapsedSidebar";
import { useIsMobile } from "@/hooks";
import type { Chat } from "@/types";
import { RoundedPanelLeft } from "../icons/RoundedPanelLeft";

type Props = {
  onDeleteRequest: (chatId: string) => void;
  onRenameRequest: (chat: Chat) => void;
  chats: Chat[];
  isFetchingChats: boolean;
  setChats: (chats: Chat[]) => void;
  setIsSettingsModalOpen: (value: boolean) => void;
};

export default function Sidebar({ chats, isFetchingChats, onDeleteRequest, onRenameRequest, setIsSettingsModalOpen }: Props) {
  const { user } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const userBtnRef = useRef<HTMLDivElement>(null);

  const sidebarRef = useRef<HTMLElement>(null);

  const openClerkMenu = () => {
    const btn = userBtnRef.current?.querySelector("button");
    btn?.click();
  };

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <>
      {isMobile && !collapsed && <div className="fixed inset-0 bg-black/40 z-20" onClick={() => setCollapsed(true)} />}
      <aside
        ref={sidebarRef}
        className="fixed md:relative h-dvh w-3/4 sm:w-64 rounded-r-3xl sm:rounded-r-none bg-[#fbfbfb] border-r border-gray-500/20 flex flex-col z-30 shrink-0"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.webp" className="h-6 w-6" />
            <span className="font-semibold text-sm">Chatty-AI</span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="h-8 w-8 text-gray-500 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-100"
          >
            <RoundedPanelLeft size="16" />
          </button>
        </div>

        <div className="px-3 pb-2 border-b border-secondary space-y-1">
          <button onClick={createChat} className="w-full px-3 py-2 text-sm flex items-center gap-2 rounded-lg hover:bg-gray-100 active:bg-gray-100">
            <BadgePlus size={16} />
            New chat
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-full px-3 py-2 text-sm flex items-center gap-2 rounded-lg hover:bg-gray-100 active:bg-gray-100"
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        <nav id="sideBar" className="px-3 py-2 overflow-y-auto grow space-y-1">
          {isFetchingChats && <div className="text-xs text-gray-400 text-center py-4">Loading chats…</div>}

          {!isFetchingChats && chats.length === 0 && <div className="text-xs text-gray-400 text-center py-4">No chats yet</div>}

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
                    "group relative flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-gray-100 active:bg-gray-100",
                    isActive ? "font-medium bg-gray-200/60" : "",
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
                    "p-1 rounded-md hover:bg-gray-200 active:bg-gray-200 transition",
                    isMenuOpen || isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-active:opacity-100",
                  ].join(" ")}
                  aria-label="Open chat menu"
                >
                  <MoreHorizontal size={16} />
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-3 top-full mt-1 w-32 bg-[#fbfbfb] border border-secondary shadow-lg rounded-md z-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onRenameRequest(chat);
                      }}
                      className="w-full px-3 py-2 text-xs text-primary flex items-center gap-2 hover:bg-gray-100 active:bg-gray-100"
                    >
                      <Pencil size={14} />
                      Rename
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onDeleteRequest(chat.id);
                      }}
                      className="w-full px-3 py-2 text-xs text-red-600 flex items-center gap-2 hover:bg-red-50 active:bg-red-50"
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
          className="border-t border-secondary px-4 py-3 flex items-center justify-between mt-auto hover:bg-gray-100 active:bg-gray-100 rounded-r-3xl cursor-pointer"
        >
          <span className="text-sm truncate max-w-35">{user?.fullName ?? user?.username ?? "User"}</span>

          <div ref={userBtnRef}>
            <UserButton />
          </div>
        </div>
      </aside>
    </>
  );
}
