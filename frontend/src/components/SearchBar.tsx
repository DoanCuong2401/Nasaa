import { useState, useRef, useEffect, useCallback } from "react";
import { searchDocuments } from "../services/DocumentService";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  variant?: "default" | "homepage";
}

export function SearchBar({
  placeholder = "Search documents...",
  className = "",
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm tìm kiếm (không debounce, gọi trực tiếp)
  const handleSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchDocuments({ query: trimmed, limit: 15 });
      setResults(res);
      setShowDropdown(true);
      setActiveIndex(0);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Xử lý chọn bằng bàn phím
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const doc = results[activeIndex];
      if (doc) {
        navigate(`/article?url=${encodeURIComponent(doc.link)}`);
        setShowDropdown(false);
      }
    }
  };

  // Highlight từ khóa trong tiêu đề
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-lg ${className}`}>
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value); // gọi trực tiếp, không debounce
          }}
          onKeyDown={handleKeyDown}
          className={`w-full text-sm pr-10 ${
            variant === "homepage"
              ? "px-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              : "px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {/* Icon hoặc loading */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Dropdown kết quả */}
      {showDropdown && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            results.map((doc, idx) => (
              <li
                key={idx}
                className={`px-4 py-3 border-b last:border-0 cursor-pointer transition ${
                  idx === activeIndex ? "bg-blue-100" : "hover:bg-blue-50"
                }`}
                onClick={() => {
                  navigate(`/article?url=${encodeURIComponent(doc.link)}`);
                  setShowDropdown(false);
                }}
              >
                <h2 className="font-semibold text-gray-900">
                  {highlightText(doc.title, query)}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {doc.summary || "No summary available."}
                </p>
                <div className="mt-2 flex items-center text-blue-600 font-medium text-sm">
                  View details <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </li>
            ))
          ) : (
            !loading && (
              <li className="px-4 py-3 text-gray-500 text-sm text-center">
                No results found
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
