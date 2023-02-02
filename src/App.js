import CoursesDirectoryPage from "./pages/CoursesDirectoryPage";
import { Routes, Route } from "react-router-dom";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import Header from "./components/Header";
import Footer from "./components/Footer.js";
import Theme from "./components/ChangeTheme";
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Theme />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="directory" element={<CoursesDirectoryPage />} />
        <Route path="directory/:courseId" element={<CourseDetailPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
