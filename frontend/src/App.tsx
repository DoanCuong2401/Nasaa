import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TopicPage from "./pages/TopicPage";
import ArticlePage from "./pages/ArticlePage";
import { HomeStateProvider } from "./contexts/HomeStateContext";

function App() {
  return (
    <HomeStateProvider>
      <Router>
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<HomePage />} />
          <>

    </>
          {/* Trang Topic */}
          <Route path="/topic/:id" element={<TopicPage />} />

          {/* Trang Article */}
          <Route path="/article" element={<ArticlePage />} />

          {/* 404 fallback */}
          <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404 - Not found</h1>} />
        </Routes>
      </Router>
    </HomeStateProvider>
  );
}

export default App;
