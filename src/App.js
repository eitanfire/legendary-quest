import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "./features/courses/coursesSlice";
import { fetchComments } from "./features/comments/commentsSlice";
import { setCurrentUser, selectCurrentUser } from "./features/user/userSlice";
import CoursesDirectoryPage from "./pages/CoursesDirectoryPage";
import { Routes, Route, useLocation } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import ExternalRedirect from "./components/ExternalRedirect";
import CourseDetailPage from "./pages/CourseDetailPage";
import WarmUpPage from "./pages/WarmUpPage";
import BottomText from "./components/BottomText";
import Header from "./components/Header";
import { onAuthStateChanged, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./app/firebase.config";
// Vaporwave theme commented out for now
// import Theme from "./components/ChangeTheme";
import "./App.css";

// ARCHIVED CONTENT REFERENCE (commit: 21a9e1b):
// - TheTeachersLounge component: src/pages/TheTeachersLounge.js
// - RantPage component: src/pages/RantPage.js
// Build: v2025.11.19.01
// - TakesPage component: src/pages/TakesPage.js
// - MovieDayPage component: src/pages/MovieDayPage.js
// - fetchRants: src/features/rants/rantsSlice.js
// - fetchTakes: src/features/takes/takesSlice.js
// - Old Header/VaporWaveHeader with full navigation menu
// To restore these features, check out commit 21a9e1b

function App() {
  const BUILD_VERSION = '2025.11.19.01'; // Force cache bust
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { hash } = useLocation();
  const redirectHandled = useRef(false);
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchComments());
  }, [dispatch]);

  // Handle Google redirect result - must run BEFORE onAuthStateChanged
  useEffect(() => {
    const handleRedirectResult = async () => {
      // Prevent double execution in StrictMode
      if (redirectHandled.current) return;
      redirectHandled.current = true;

      try {
        console.log("🔍 Checking for Google redirect result...");
        const result = await getRedirectResult(auth);

        if (result) {
          const user = result.user;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const accessToken = credential?.accessToken;

          console.log("✅ Google sign-in successful:", {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            hasAccessToken: !!accessToken
          });

          // PERSIST access token to localStorage so it survives page reloads
          if (accessToken) {
            localStorage.setItem('google_access_token', accessToken);
            localStorage.setItem('google_access_token_timestamp', Date.now().toString());
            console.log("💾 Access token saved to localStorage");
          }

          // Store user with access token in Redux
          dispatch(setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            googleAccessToken: accessToken,
            driveEnabled: true
          }));
        } else {
          console.log("ℹ️ No redirect result found");
        }
      } catch (error) {
        console.error("❌ Redirect result error:", error);
      } finally {
        // Signal that redirect check is complete
        setIsCheckingRedirect(false);
      }
    };

    handleRedirectResult();
  }, [dispatch]);

  // Listen for Firebase auth state changes and sync with Redux
  useEffect(() => {
    // Don't process auth state changes while still checking for redirect result
    if (isCheckingRedirect) {
      console.log("⏳ Waiting for redirect check to complete...");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("🔄 Auth state changed - user logged in:", user.email);
        // Check if this user signed in with Google and might have Drive access
        const providerData = user.providerData.find(
          provider => provider.providerId === "google.com"
        );

        // Try to retrieve access token from localStorage (persisted from previous session)
        let googleAccessToken = null;
        if (providerData) {
          googleAccessToken = localStorage.getItem('google_access_token');
          if (googleAccessToken) {
            console.log("♻️ Retrieved access token from localStorage");
          }
        }

        // Extract only serializable properties from Firebase User
        // Firebase User objects contain methods that can't be stored in Redux
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          driveEnabled: !!providerData && !!googleAccessToken,
          googleAccessToken: googleAccessToken,
        };

        dispatch(setCurrentUser(userData));
      } else {
        console.log("🔄 Auth state changed - user logged out");
        // Clear access token from localStorage on logout
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_access_token_timestamp');
        dispatch(setCurrentUser(null));
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch, isCheckingRedirect]);

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
      {/* Vaporwave theme toggle commented out for now */}
      {/* <Theme className="spikes" /> */}
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Redirect to external personal website */}
        <Route path="lounge" element={<ExternalRedirect to="https://eitans.website" />} />
        <Route path="TheTeachersLounge" element={<ExternalRedirect to="https://eitans.website" />} />
        {/* User account management - preserved for future CRUD operations */}
        <Route path="account" element={<AccountPage />} />
        <Route path="directory" element={<CoursesDirectoryPage />} />
        <Route path="directory/:courseId" element={<CourseDetailPage />} />
        <Route path="warmups" element={<WarmUpPage />} />
      </Routes>
      <BottomText />
    </div>
  );
}

export default App;
