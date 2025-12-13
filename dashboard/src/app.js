import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { Chart, registerables } from 'chart.js';
import { format, parseISO } from 'date-fns';
import './styles.css';

// Register Chart.js components
Chart.register(...registerables);

// Firebase configuration (loaded from environment variables)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// Connect to Firebase Emulators when running locally
if (window.location.hostname === 'localhost') {
  console.log('🔧 Connecting to Firebase Functions Emulator on localhost:5001');
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

// DOM elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const refreshBtn = document.getElementById('refresh-btn');
const timeRangeSelect = document.getElementById('time-range');
const loadingOverlay = document.getElementById('loading-overlay');
const loginError = document.getElementById('login-error');

// Chart instances
let charts = {};

// Current data
let analyticsData = null;

// Initialize app
function init() {
  // Set up auth state observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showDashboard();
      loadAnalytics();
    } else {
      showLogin();
    }
  });

  // Set up event listeners
  loginBtn.addEventListener('click', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  refreshBtn.addEventListener('click', loadAnalytics);
  timeRangeSelect.addEventListener('change', loadAnalytics);
}

// Authentication handlers
async function handleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    loginError.classList.remove('show');
  } catch (error) {
    console.error('Login error:', error);
    loginError.textContent = `Login failed: ${error.message}`;
    loginError.classList.add('show');
  }
}

async function handleLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// UI state management
function showLogin() {
  loginScreen.style.display = 'flex';
  dashboardScreen.style.display = 'none';
}

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboardScreen.style.display = 'block';
}

function showLoading() {
  loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

// Load analytics data
async function loadAnalytics() {
  showLoading();

  try {
    const getAnalytics = httpsCallable(functions, 'getAnalytics');
    const result = await getAnalytics({ timeRange: timeRangeSelect.value });
    analyticsData = result.data;

    updateDashboard();
  } catch (error) {
    console.error('Error loading analytics:', error);
    alert(`Failed to load analytics: ${error.message}`);
  } finally {
    hideLoading();
  }
}

// Update dashboard with analytics data
function updateDashboard() {
  if (!analyticsData) return;

  updateStatCards();
  updateCharts();
  updateActivityFeed();
}

// Update stat cards
function updateStatCards() {
  document.getElementById('total-requests').textContent = analyticsData.totalRequests.toLocaleString();
  document.getElementById('success-rate').textContent = `${analyticsData.successRate.toFixed(1)}%`;
  document.getElementById('avg-response-time').textContent = `${analyticsData.avgGenerationTime.toFixed(2)}s`;
  document.getElementById('total-tokens').textContent = analyticsData.totalTokens.toLocaleString();
}

// Update all charts
function updateCharts() {
  createRequestsTimelineChart();
  createProviderChart();
  createModelChart();
  createResponseTimeChart();
  createErrorChart();
  createTokenUsageChart();
}

// Create Request Volume Over Time chart
function createRequestsTimelineChart() {
  const ctx = document.getElementById('requests-timeline-chart');

  // Destroy existing chart
  if (charts.requestsTimeline) {
    charts.requestsTimeline.destroy();
  }

  const timeline = analyticsData.timeline;
  const dates = Object.keys(timeline).sort();
  const successData = dates.map(date => timeline[date].successes);
  const failureData = dates.map(date => timeline[date].failures);

  charts.requestsTimeline = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.map(date => format(parseISO(date), 'MMM d')),
      datasets: [
        {
          label: 'Successful',
          data: successData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Failed',
          data: failureData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Create Provider Distribution chart
function createProviderChart() {
  const ctx = document.getElementById('provider-chart');

  if (charts.provider) {
    charts.provider.destroy();
  }

  charts.provider = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['OpenAI', 'Gemini'],
      datasets: [{
        data: [analyticsData.providers.openai, analyticsData.providers.gemini],
        backgroundColor: ['#2563eb', '#10b981']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Create Model Distribution chart
function createModelChart() {
  const ctx = document.getElementById('model-chart');

  if (charts.model) {
    charts.model.destroy();
  }

  const models = Object.keys(analyticsData.models);
  const data = Object.values(analyticsData.models);

  charts.model = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: models,
      datasets: [{
        data: data,
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Create Response Time Trend chart
function createResponseTimeChart() {
  const ctx = document.getElementById('response-time-chart');

  if (charts.responseTime) {
    charts.responseTime.destroy();
  }

  const timeline = analyticsData.timeline;
  const dates = Object.keys(timeline).sort();
  const avgTimes = dates.map(date => {
    const dayData = timeline[date];
    return dayData.requests > 0 ? dayData.totalTime / dayData.requests : 0;
  });

  charts.responseTime = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.map(date => format(parseISO(date), 'MMM d')),
      datasets: [{
        label: 'Avg Response Time (s)',
        data: avgTimes,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Seconds'
          }
        }
      }
    }
  });
}

// Create Error Types chart
function createErrorChart() {
  const ctx = document.getElementById('error-chart');

  if (charts.error) {
    charts.error.destroy();
  }

  const errors = analyticsData.errors;
  const errorTypes = Object.keys(errors);
  const errorCounts = Object.values(errors);

  if (errorTypes.length === 0) {
    // No errors - show empty state
    ctx.parentElement.innerHTML = '<h3>Error Types</h3><p style="text-align: center; padding: 2rem; color: #10b981;">No errors in this period! 🎉</p>';
    return;
  }

  charts.error = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: errorTypes,
      datasets: [{
        data: errorCounts,
        backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Create Token Usage by Provider chart
function createTokenUsageChart() {
  const ctx = document.getElementById('token-usage-chart');

  if (charts.tokenUsage) {
    charts.tokenUsage.destroy();
  }

  charts.tokenUsage = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['OpenAI', 'Gemini'],
      datasets: [{
        label: 'Total Tokens',
        data: [analyticsData.tokensByProvider.openai, analyticsData.tokensByProvider.gemini],
        backgroundColor: ['#2563eb', '#10b981']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Update activity feed
function updateActivityFeed() {
  const feed = document.getElementById('activity-feed');
  feed.innerHTML = '';

  if (analyticsData.recentActivity.length === 0) {
    feed.innerHTML = '<p style="text-align: center; padding: 2rem; color: #6b7280;">No activity in this period</p>';
    return;
  }

  analyticsData.recentActivity.forEach(activity => {
    const item = document.createElement('div');
    item.className = 'activity-item';

    const timestamp = format(parseISO(activity.timestamp), 'MMM d, h:mm a');

    item.innerHTML = `
      <div class="activity-info">
        <div class="activity-topic">${activity.prompt}</div>
        <div class="activity-meta">
          ${timestamp} • ${activity.provider} (${activity.model}) •
          ${activity.generationTime.toFixed(2)}s •
          ${activity.tokensUsed.toLocaleString()} tokens
        </div>
      </div>
      <div class="activity-status ${activity.success ? 'success' : 'error'}">
        ${activity.success ? '✓ Success' : '✗ Failed'}
      </div>
    `;

    feed.appendChild(item);
  });
}

// Start the app
init();
