import React, { useEffect, useMemo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import MyState from './context/data/myState'
import AuthProvider from './components/auth/AuthProvider'
// Added import for visitor tracking
import { trackVisitor, updateVisitorActivity } from './utils/visitorTracker'

function App() {
  useEffect(() => {
    let visitorId = null;
    
    try {
      // Track visitor when app loads (non-blocking)
      setTimeout(() => {
        visitorId = trackVisitor();
      }, 1000);
    } catch (error) {
      console.warn('Visitor tracking failed:', error);
    }
    
    // Update visitor activity periodically if tracking is enabled
    let activityInterval = null;
    if (visitorId) {
      activityInterval = setInterval(() => {
        try {
          updateVisitorActivity(visitorId);
        } catch (error) {
          console.warn('Failed to update visitor activity:', error);
        }
      }, 60000); // Update every minute
    }
    
    return () => {
      if (activityInterval) {
        clearInterval(activityInterval);
      }
    };
  }, []);

  // Memoize the context providers to prevent unnecessary re-renders
  const appContent = useMemo(() => (
    <MyState>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
          <ToastContainer position="bottom-right" />
        </div>
      </AuthProvider>
    </MyState>
  ), []);

  return (
    <Router>
      {appContent}
    </Router>
  )
}

export default App