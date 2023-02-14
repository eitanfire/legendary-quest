import CoursesDirectoryPage from "./pages/CoursesDirectoryPage";
import { Routes, Route } from "react-router-dom";
import ConnectionPage from "./pages/ConnectionPage";
import TheTeachersLounge from "./pages/TheTeachersLounge";
import AboutPage from "./pages/AboutPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import Header from "./components/Header";
import BottomText from "./components/BottomText";
import Footer from "./components/Footer.js";
import Theme from "./components/ChangeTheme";
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Theme />
      <Routes>
        <Route path="/" element={<TheTeachersLounge />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="connect" element={<ConnectionPage />} />
        <Route path="directory" element={<CoursesDirectoryPage />} />
        <Route path="directory/:courseId" element={<CourseDetailPage />} />
      </Routes>
      <BottomText />
    </div>
  );
}

export default App;
