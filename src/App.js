import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCourses } from "./features/courses/coursesSlice";
import { fetchRants } from "./features/rants/rantsSlice";
import { fetchComments } from "./features/comments/commentsSlice";
import CoursesDirectoryPage from "./pages/CoursesDirectoryPage";
import { Routes, Route, useLocation } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
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
// import GoogleShare from "./components/GoogleShare";

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
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="App">
      <Theme className="spikes" />
      {/* <span className="#page-container"> */}
      <Routes>
        <Route path="/" element={<TheTeachersLounge />} />
        <Route path="/TheTeachersLounge" element={<TheTeachersLounge />} />
        <Route path="rant" element={<RantPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="watch" element={<MovieDayPage />} />
        <Route path="takes" element={<TakesPage />} />
        <Route path="directory" element={<CoursesDirectoryPage />} />
        <Route path="directory/:courseId" element={<CourseDetailPage />} />
        <Route path="warmups" element={<WarmUpPage />} />
        {/* <Route path="directory/:courseId" element={<GoogleShare />} /> */}
      </Routes>
      {/* </span> */}
      <BottomText />
    </div>
  );
}

export default App;
