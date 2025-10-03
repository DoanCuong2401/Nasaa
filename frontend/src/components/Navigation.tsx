import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

// ✅ Dùng id số để trùng với TopicPage
const topics = [
    { id: "1", name: "Vertebrate" },
    { id: "2", name: "Plants" },
    { id: "3", name: "Microbes" },
    { id: "4", name: "Fungi" },
    { id: "5", name: "Human Cell & Biomedical" },
    { id: "6", name: "Systems Biology & Tools" }
];

export function Navigation() {
    const [showTopicsDropdown, setShowTopicsDropdown] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowTopicsDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const scrollToSection = (sectionId: string) => {
        if (location.pathname === "/") {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };

    return (
        <nav className="flex items-center space-x-6">
            {/* Home */}
            <Link
                to="/"
                onClick={() => {
                    if (location.pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }, 100);
                    }
                }}
                className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Home
            </Link>

            {/* Topics Dropdown */}
            <div ref={dropdownRef} className="relative">
                <button
                    onClick={() => setShowTopicsDropdown(!showTopicsDropdown)}
                    className="flex items-center space-x-0.5 text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                    <span>Topics</span>
                    <ChevronDown className="w-3 h-3" />
                </button>

                {showTopicsDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000]">
                        {topics.map((topic) => (
                            <Link
                                key={topic.id}
                                to={`/topic/${topic.id}`} // ✅ path bằng số id
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0"
                                onClick={() => setShowTopicsDropdown(false)}
                            >
                                {topic.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* About */}
            <button
                onClick={() => scrollToSection("about")}
                className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                About
            </button>

            {/* Feedback */}
            <button
                onClick={() => scrollToSection("feedback")}
                className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Feedback
            </button>
        </nav>
    );
}
