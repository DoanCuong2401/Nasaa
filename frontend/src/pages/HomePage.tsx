import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { BackToTopButton } from "../components/BackToTopButton";
import { SearchBar } from "../components/SearchBar";
import StarBackground from "../components/StarBackground";

export default function HomePage() {
    const navigate = useNavigate();
    // const [searchQuery, setSearchQuery] = useState("");
    const [showTopics, setShowTopics] = useState(false);

    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (searchQuery.trim()) {
    //         navigate(`/article?query=${encodeURIComponent(searchQuery)}`);
    //     }
    // };

    const topics = [
        { id: 1, key: "vertebrate", name: "Vertebrate", emoji: "🦴" },
        { id: 2, key: "plants", name: "Plants", emoji: "🌱" },
        { id: 3, key: "microbes", name: "Microbes", emoji: "🦠" },
        { id: 4, key: "fungi", name: "Fungi", emoji: "🍄" },
        { id: 5, key: "human-cell", name: "Human Cell & Biomedical", emoji: "🧪" },
        { id: 6, key: "systems-biology", name: "Systems Biology & Tools", emoji: "💻" },
    ];

    return (
        <div className="min-h-screen flex flex-col relative">
          <StarBackground />
{/* ✅ NavBar (Logo trái, Search giữa, Links phải) */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow">
                <div className="container mx-auto px-6 py-3 flex items-center justify-between">

                    {/* Logo */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        {/* <img src="/images/logo.png" alt="Logo" className="h-10 w-10" /> */}
                        <span className="text-xl font-bold text-blue-600">NASA Space Apps Challenge</span>
                    </div>
                    {/* SearchBar ở giữa */}
                    <SearchBar className="mx-8 flex-1" placeholder="Search articles..." />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                        >
                        </button>
                    
                    {/* Nav Links */}
                    <nav className="flex items-center space-x-4 text-sm font-medium text-gray-700">
                        <button onClick={() => navigate("/")} className="hover:text-blue-600">
                            Home
                        </button>

                        {/* Dropdown Topics */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTopics(!showTopics)}
                                className="hover:text-blue-600 flex items-center space-x-1"
                            >
                                <span>Topics</span>
                                <span className={`transform transition ${showTopics ? "rotate-180" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            {showTopics && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                                    <ul className="py-2">
                                        {topics.map((topic) => (
                                            <li
                                                key={topic.id}
                                                onClick={() => {
                                                    navigate(`/topic/${topic.id}`);
                                                    setShowTopics(false);
                                                }}
                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center space-x-2"
                                            >
                                                <span>{topic.emoji}</span>
                                                <span>{topic.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>


                        <button
                            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                            className="hover:text-blue-600"
                        >
                            About
                        </button>

                        <button
                            onClick={() => document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" })}
                            className="hover:text-blue-600"
                        >
                            Feedback
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
<section className="pt-12 pb-20 text-center from-white to-blue-50">
  {/* Logo to, gần navbar hơn */}
  <img 
    src="/images/logo.png" 
    alt="Logo" 
    className="mx-auto mb-6 h-64 w-64 md:h-80 md:w-80 drop-shadow-2xl"
  />

  {/* Chữ to, xám đậm */}
<h1 className="text-7xl md:text-8xl font-extrabold tracking-tight mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
  AstroMorphosis
</h1>


  {/* Subtitle */}
  <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
    Exploring biological transformations in space environments through cutting-edge research
  </p>
</section>




      {/* Topics Section */}
      <section id="topics" className="py-20 container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/topic/${topic.id}`)}
              className="cursor-pointer bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition"
            >
              <div className="text-5xl mb-4">{topic.emoji}</div>
              <h3 className="text-lg font-bold text-gray-800">{topic.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 ">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">About Us</h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We are a team from <strong>Hanoi University of Science and Technology</strong>, joining the 
                <strong> NASA Space Apps Challenge 2025</strong>. Our mission is to advance our understanding 
                of biological systems in space environments through innovative research and collaborative knowledge sharing.
              </p>
              <p className="text-xl font-semibold text-blue-600">
                "SHARE TO BE SHARED"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-16 ">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Share Your Thoughts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Anonymous Researcher</h4>
                    <p className="text-gray-700 mt-2">"The website is so beautiful. Amazing work on presenting complex space biology research in such an accessible way!"</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Space Biology Student</h4>
                    <p className="text-gray-700 mt-2">"This platform makes cutting-edge research so much more understandable. Great resource for the scientific community!"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </div>
  );
}
