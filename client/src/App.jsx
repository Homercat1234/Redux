import Blog from "./pages/Blog";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" index element={<Blog />} />
          <Route path="/home" index element={<Blog />} />
          <Route path="/index" index element={<Blog />} />
          <Route path="/login" element={<Blog />} />
          <Route path="/register" element={<Blog />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/*" element={<Blog />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
