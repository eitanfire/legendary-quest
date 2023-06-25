import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCourses } from "./features/courses/coursesSlice";
import { fetchRants } from "./features/rants/rantsSlice";
import CoursesDirectoryPage from "./pages/CoursesDirectoryPage";
import { Routes, Route } from "react-router-dom";
import ConnectionPage from "./pages/ConnectionPage";
import TheTeachersLounge from "./pages/TheTeachersLounge";
import AboutPage from "./pages/AboutPage";
import CourseDetailPage from "./pages/CourseDetailPage";
// import FreeCourseCard from "./features/courses/FreeCourseCard";
import Header from "./components/Header";
import BottomText from "./components/BottomText";
import Footer from "./components/Footer.js";
import Theme from "./components/ChangeTheme";
import "./App.css";

function App() {
  const dispatch = useDispatch();
 useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchRants())
    }, [dispatch]);
 

  return (
    <div className="App">
      <Theme />
      <Routes>
        <Route path="/" element={<TheTeachersLounge />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="connect" element={<ConnectionPage />} />
        <Route path="directory" element={<CoursesDirectoryPage />} />
        <Route path="directory/:courseId" element={<CourseDetailPage />} />
        {/* <Route path="connect/:courseId" element={<FreeCourseCard />} /> */}
      </Routes>
      <BottomText />
    </div>
  );
 };

export default App;
