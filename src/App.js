import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCourses } from "./features/courses/coursesSlice";
import { fetchComments } from "./features/comments/commentsSlice";
import CoursesDirectoryPage from "./pages/CoursesDirectoryPage";
import { Routes, Route, useLocation } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import ExternalRedirect from "./components/ExternalRedirect";
import CourseDetailPage from "./pages/CourseDetailPage";
import MovieDayPage from "./pages/MovieDayPage";
import WarmUpPage from "./pages/WarmUpPage";
import BottomText from "./components/BottomText";
import Theme from "./components/ChangeTheme";
import "./App.css";

// ARCHIVED CONTENT REFERENCE:
// - TheTeachersLounge component: src/pages/TheTeachersLounge.js (commit: bd51efc)
// - RantPage component: src/pages/RantPage.js (commit: bd51efc)
// - TakesPage component: src/pages/TakesPage.js (commit: bd51efc)
// - fetchRants: src/features/rants/rantsSlice.js
// - fetchTakes: src/features/takes/takesSlice.js
// To restore these features, check out the commit before this restructure

function App() {
  const dispatch = useDispatch();
  const { hash } = useLocation();

  useEffect(() => {
    dispatch(fetchCourses());
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
        {/* Redirect to external personal website */}
        <Route path="lounge" element={<ExternalRedirect to="https://eitans.website" />} />
        <Route path="TheTeachersLounge" element={<ExternalRedirect to="https://eitans.website" />} />
        {/* User account management - preserved for future CRUD operations */}
        <Route path="account" element={<AccountPage />} />
        <Route path="watch" element={<MovieDayPage />} />
        <Route path="directory" element={<CoursesDirectoryPage />} />
        <Route path="directory/:courseId" element={<CourseDetailPage />} />
        <Route path="warmups" element={<WarmUpPage />} />
      </Routes>
      <BottomText />
    </div>
  );
}

export default App;
