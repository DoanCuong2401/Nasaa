import { useState, useRef, useEffect } from "react";
import { searchDocuments } from "../services/DocumentService";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

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
  // const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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

  // Hàm tìm kiếm
  const handleSearch = async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 1) {
      setResults([]);
      return;
    }
    //setLoading(true);
    try {
      // ✅ cho limit lớn hơn để nhiều gợi ý
      const res = await searchDocuments({ query: trimmed, limit: 15 });
      setResults(res);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      //setLoading(false);
    }
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
            handleSearch(e.target.value); // realtime
          }}
          className={`w-full text-sm pr-10 ${
            variant === "homepage"
              ? "px-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              : "px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {/* Icon kính lúp */}
        <button
          type="button"
          onClick={() => handleSearch(query)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown kết quả */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((doc, idx) => (
            <li
              key={idx}
              className="px-4 py-3 border-b last:border-0 hover:bg-blue-50 transition cursor-pointer"
              onClick={() => {
                navigate(`/article?url=${encodeURIComponent(doc.link)}`);
                setShowDropdown(false);
              }}
            >
              <h2 className="font-semibold text-gray-900">{doc.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {doc.summary || "No summary available."}
              </p>
              <div className="mt-2 flex items-center text-blue-600 font-medium text-sm">
                View details <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
