import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { useDebounce } from "use-debounce";
import type { SearchResult } from "@/types";
import SearchSkeleton from "./SearchSkeleton";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

type Props = {
  onClose: () => void;
};

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      const token = await getToken();
      if (!token) return;

      setIsLoading(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error("Something went wrong");
          }
          return data;
        })
        .then((data) => {
          setResults(data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchResults();
  }, [debouncedQuery, getToken]);

  function HighlightedText(text: string, highlight: string) {
    if (!highlight.trim()) return <>{text}</>;

    const lowerText = text.toLowerCase();
    const lowerHighlight = highlight.toLowerCase();

    const index = lowerText.indexOf(lowerHighlight);
    if (index === -1) return <>{text}</>;

    return (
      <>
        {text.slice(0, index)}
        <b className="text-primary">{text.slice(index, index + highlight.length)}</b>
        {text.slice(index + highlight.length)}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 backdrop-blur-[1px] bg-secondary opacity-10" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] bg-white">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur">
          <input
            type="text"
            placeholder="Search messages…"
            value={query}
            autoFocus={true}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none text-primary placeholder:text-gray-400 text-sm px-2 py-1 rounded-md transition"
          />

          <button onClick={onClose} className="p-1 rounded-full text-primary hover:bg-gray-200 active:bg-gray-200 transition">
            <X className="w-5 h-5 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scroll p-3 bg-white">
          {results.length === 0 && query.length >= 3 && !isLoading && (
            <div className="text-center py-8 text-gray-lab text-xs">No results found for "{query}"</div>
          )}

          {query.length < 3 && <div className="text-center py-8 text-gray-lab text-[10px]">Type at least 3 characters to search</div>}

          {isLoading && query.length >= 3 && (
            <>
              <SearchSkeleton />
              <SearchSkeleton />
              <SearchSkeleton />
            </>
          )}
          {!isLoading &&
            results.map((item) => (
              <Link
                to={`/c/${item.chatId}`}
                key={item.chatId}
                onClick={onClose}
                className="group block w-full rounded-xl p-3 mb-1 hover:bg-gray-100 active:bg-gray-100 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2 items-center truncate">
                    <MessageCircle className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-primary leading-tight truncate">{item.chat.title}</span>
                      <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-1">{HighlightedText(item.text, query)}</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-500 bg-gray-100 group-hover:bg-white group-active:bg-white px-2 py-0.5 rounded-full shrink-0">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
