import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCourses } from "./features/courses/coursesSlice";
import { fetchRants } from "./features/rants/rantsSlice";
import { fetchComments } from "./features/comments/commentsSlice";
import CoursesDirectoryPage from "./pages/CoursesDirectoryPage";
import { Routes, Route, useLocation } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import TheTeachersLounge from "./pages/TheTeachersLounge";
import RantPage from "./pages/RantPage";
import TakesPage from "./pages/TakesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import MovieDayPage from "./pages/MovieDayPage";
import WarmUpPage from "./pages/WarmUpPage";
import BottomText from "./components/BottomText";
import Theme from "./components/ChangeTheme";
import "./App.css";
import { fetchTakes } from "./features/takes/takesSlice";

function App() {
  const dispatch = useDispatch();
  const { hash } = useLocation();

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchRants());
    dispatch(fetchTakes());
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    if (hash) {
      if (hash === "#TeachersLounge") {
        const element = document.getElementById("TeachersLounge");
        if (element) {
          // Temporarily remove the smooth scroll behavior
          element.scrollIntoView({ behavior: "auto" });
          // Add back the smooth scroll behavior after navigation
          setTimeout(() => {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.search
            ); // Clear the hash to prevent scrolling
          }, 0);
        }
      } else {
        const element = document.getElementById(hash.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [hash]);

  return (
    <div className="App">
      <Theme className="spikes" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="lounge" element={<TheTeachersLounge />} />
        <Route path="TheTeachersLounge" element={<TheTeachersLounge />} />
        <Route path="rant" element={<RantPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="watch" element={<MovieDayPage />} />
        <Route path="takes" element={<TakesPage />} />
        <Route path="directory" element={<CoursesDirectoryPage />} />
        <Route path="directory/:courseId" element={<CourseDetailPage />} />
        <Route path="warmups" element={<WarmUpPage />} />
      </Routes>
      <BottomText />
    </div>
  );
}

export default App;
