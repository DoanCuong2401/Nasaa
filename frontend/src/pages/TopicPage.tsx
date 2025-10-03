import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar"; // ✅ đúng

import { Navigation } from"../components/Navigation";
import { BackToTopButton } from"../components/BackToTopButton";
import { Footer } from"../components/Footer";
import { ArrowLeft, Check, Star } from "lucide-react";
import { getDocumentsByCategory } from "../services/DocumentService";
import type { Document } from "../types";

// Map id → topic name
const topicNames: Record<string, string> = {
  "1": "Vertebrate",
  "2": "Plants",
  "3": "Microbes",
  "4": "Fungi",
  "5": "Human Cell & Biomedical",
  "6": "Systems Biology & Tools",
};

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  // trạng thái giống ArticlesPage
  const [readDocs, setReadDocs] = useState<Set<string>>(new Set());
  const [highlightedDocs, setHighlightedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const results = await getDocumentsByCategory(Number(id));
        setDocs(results);
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();

    // load trạng thái từ localStorage
    const savedRead = localStorage.getItem("readDocs");
    const savedHighlighted = localStorage.getItem("highlightedDocs");

    if (savedRead) setReadDocs(new Set(JSON.parse(savedRead)));
    if (savedHighlighted) setHighlightedDocs(new Set(JSON.parse(savedHighlighted)));
  }, [id]);

  const toggleRead = (docId: string) => {
    const newRead = new Set(readDocs);
    if (newRead.has(docId)) {
      newRead.delete(docId);
    } else {
      newRead.add(docId);
    }
    setReadDocs(newRead);
    localStorage.setItem("readDocs", JSON.stringify([...newRead]));
  };

  const toggleHighlight = (docId: string) => {
    const newHighlighted = new Set(highlightedDocs);
    if (newHighlighted.has(docId)) {
      newHighlighted.delete(docId);
    } else {
      newHighlighted.add(docId);
    }
    setHighlightedDocs(newHighlighted);
    localStorage.setItem("highlightedDocs", JSON.stringify([...newHighlighted]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Back buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span> Neromind </span>
              </Link>
              <span className="text-gray-400"> </span>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                
              </button>
            </div>

            <SearchBar placeholder="Search documents..." />
            <Navigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 text-center">
            {topicNames[id ?? ""] || `Topic ${id}`}
          </h1>
          <p className="text-gray-600 text-center mb-12">Related Research Documents</p>

          {loading && <p className="text-center text-blue-500">Loading...</p>}

          {!loading && docs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No documents found for this topic.</p>
            </div>
          )}

          {!loading && docs.length > 0 && (
            <div className="space-y-8">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    readDocs.has(String(doc.id)) ? "opacity-70" : ""
                  } ${
                    highlightedDocs.has(String(doc.id)) ? "ring-4 ring-yellow-300" : ""
                  }`}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">📄</span>
                          </div>
                          <div>
                            <Link
                              to={`/article?url=${encodeURIComponent(doc.link)}`}
                              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                              onClick={() => {
                                const newRead = new Set(readDocs);
                                newRead.add(String(doc.id));
                                setReadDocs(newRead);
                                localStorage.setItem("readDocs", JSON.stringify([...newRead]));
                              }}
                            >
                              {doc.title}
                            </Link>
                            {/* <p className="text-gray-500 text-sm">{doc.authors?.join(", ")}</p> */}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {doc.summary || "Still Researching"}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <button
                          onClick={() => toggleHighlight(String(doc.id))}
                          className={`p-2 rounded-full transition-colors ${
                            highlightedDocs.has(String(doc.id))
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-yellow-100"
                          }`}
                          title="Highlight document"
                        >
                          <Star className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => toggleRead(String(doc.id))}
                          className={`p-2 rounded-full transition-colors ${
                            readDocs.has(String(doc.id))
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-green-100"
                          }`}
                          title="Mark as read"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}