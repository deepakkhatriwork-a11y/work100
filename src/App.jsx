import React, { useEffect } from 'react'
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
    // Track visitor when app loads
    const visitorId = trackVisitor();
    
    // Update visitor activity periodically
    const activityInterval = setInterval(() => {
      updateVisitorActivity(visitorId);
    }, 60000); // Update every minute
    
    return () => {
      clearInterval(activityInterval);
    };
  }, []);

  return (
    <MyState>
      <Router>
        <AuthProvider>
          <div className="app">
            <AppRoutes />
            <ToastContainer position="bottom-right" />
          </div>
        </AuthProvider>
      </Router>
    </MyState>
  )
}

export default App