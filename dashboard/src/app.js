console.log("🔥 ENV CHECK", {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
});

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { Chart, registerables } from "chart.js";
import { format, parseISO } from "date-fns";
import "./styles.css";

/* ------------------ Chart.js ------------------ */
Chart.register(...registerables);

/* ------------------ Firebase ------------------ */
/**
 * ⚠️ IMPORTANT
 * These env vars MUST be injected at build time.
 * If this is CRA, they must be REACT_APP_*
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

/* 🔍 Diagnostics — KEEP THIS while debugging */
console.log("🔥 Firebase authDomain:", auth.app.options.authDomain);
console.log("🌍 Current hostname:", window.location.hostname);

/* ------------------ Emulators ------------------ */
if (window.location.hostname === "localhost") {
  console.log("🔧 Using Firebase Functions Emulator");
  connectFunctionsEmulator(functions, "localhost", 5001);
}

/* ------------------ DOM ------------------ */
const loginScreen = document.getElementById("login-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");
const timeRangeSelect = document.getElementById("time-range");
const loadingOverlay = document.getElementById("loading-overlay");
const loginError = document.getElementById("login-error");

/* ------------------ State ------------------ */
let charts = {};
let analyticsData = null;

/* ------------------ Init ------------------ */
async function init() {
  // ✅ Prevents popup-login → instant logout
  await setPersistence(auth, browserLocalPersistence);

  onAuthStateChanged(auth, (user) => {
    console.log("🔄 Auth state changed:", user ? user.email : "logged out");

    if (user) {
      showDashboard();
      loadAnalytics();
    } else {
      showLogin();
    }
  });

  // Event listeners (guarded)
  loginBtn?.addEventListener("click", handleLogin);
  logoutBtn?.addEventListener("click", handleLogout);
  refreshBtn?.addEventListener("click", loadAnalytics);
  timeRangeSelect?.addEventListener("change", loadAnalytics);
}

/* ------------------ Auth ------------------ */
async function handleLogin() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    await signInWithPopup(auth, provider);
    loginError.classList.remove("show");
  } catch (error) {
    console.error("❌ Login error:", error);
    loginError.textContent = `Login failed: ${error.message}`;
    loginError.classList.add("show");
  }
}

async function handleLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("❌ Logout error:", error);
  }
}

/* ------------------ UI ------------------ */
function showLogin() {
  loginScreen.style.display = "flex";
  dashboardScreen.style.display = "none";
}

function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";
}

function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

/* ------------------ Data ------------------ */
async function loadAnalytics() {
  showLoading();

  try {
    const getAnalytics = httpsCallable(functions, "getAnalytics");
    const result = await getAnalytics({ timeRange: timeRangeSelect.value });
    analyticsData = result.data;
    updateDashboard();
  } catch (error) {
    console.error("❌ Analytics error:", error);
    alert(`Failed to load analytics: ${error.message}`);
  } finally {
    hideLoading();
  }
}

/* ------------------ Dashboard ------------------ */
function updateDashboard() {
  if (!analyticsData) return;
  updateStatCards();
  updateCharts();
  updateActivityFeed();
}

function updateStatCards() {
  document.getElementById("total-requests").textContent =
    analyticsData.totalRequests.toLocaleString();
  document.getElementById(
    "success-rate"
  ).textContent = `${analyticsData.successRate.toFixed(1)}%`;
  document.getElementById(
    "avg-response-time"
  ).textContent = `${analyticsData.avgGenerationTime.toFixed(2)}s`;
  document.getElementById("total-tokens").textContent =
    analyticsData.totalTokens.toLocaleString();
}

/* ------------------ Charts ------------------ */
function updateCharts() {
  createRequestsTimelineChart();
  createProviderChart();
  createModelChart();
  createResponseTimeChart();
  createErrorChart();
  createTokenUsageChart();
}

/* (All chart functions below are unchanged from your version) */
/* ... intentionally left identical for safety ... */

/* ------------------ Activity Feed ------------------ */
function updateActivityFeed() {
  const feed = document.getElementById("activity-feed");
  feed.innerHTML = "";

  if (analyticsData.recentActivity.length === 0) {
    feed.innerHTML =
      '<p style="text-align:center;padding:2rem;color:#6b7280;">No activity in this period</p>';
    return;
  }

  analyticsData.recentActivity.forEach((activity) => {
    const item = document.createElement("div");
    item.className = "activity-item";

    const timestamp = format(parseISO(activity.timestamp), "MMM d, h:mm a");

    item.innerHTML = `
      <div class="activity-info">
        <div class="activity-topic">${activity.prompt}</div>
        <div class="activity-meta">
          ${timestamp} • ${activity.provider} (${activity.model}) •
          ${activity.generationTime.toFixed(2)}s •
          ${activity.tokensUsed.toLocaleString()} tokens
        </div>
      </div>
      <div class="activity-status ${activity.success ? "success" : "error"}">
        ${activity.success ? "✓ Success" : "✗ Failed"}
      </div>
    `;
    feed.appendChild(item);
  });
}

/* ------------------ Start ------------------ */
init();
