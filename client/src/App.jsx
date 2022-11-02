import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/home" index element={<Home />} />
          <Route path="/index" index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
