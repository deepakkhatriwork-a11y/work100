import { database } from '../firebase/firebaseConfig';
import { ref, set, onDisconnect, serverTimestamp, onValue, query, orderByChild, startAt, endAt } from 'firebase/database';

// Generate a unique visitor ID
const generateVisitorId = () => {
  return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Track visitor in Realtime Database
export const trackVisitor = () => {
  const visitorId = generateVisitorId();
  const visitorRef = ref(database, 'visitors/' + visitorId);
  
  // Set visitor data with timestamp
  set(visitorRef, {
    timestamp: serverTimestamp(),
    lastActive: serverTimestamp()
  });
  
  // Remove visitor when they disconnect
  onDisconnect(visitorRef).remove();
  
  return visitorId;
};

// Get real-time visitor count
export const getVisitorCount = (callback) => {
  const visitorsRef = ref(database, 'visitors');
  
  // Listen for changes in visitors
  onValue(visitorsRef, (snapshot) => {
    const visitors = snapshot.val();
    const count = visitors ? Object.keys(visitors).length : 0;
    callback(count);
  });
  
  return visitorsRef;
};

// Update visitor activity timestamp
export const updateVisitorActivity = (visitorId) => {
  const visitorRef = ref(database, 'visitors/' + visitorId);
  set(visitorRef, {
    timestamp: serverTimestamp(),
    lastActive: serverTimestamp()
  });
};

// Get active visitors (within last 5 minutes)
export const getActiveVisitors = (callback) => {
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  const visitorsRef = ref(database, 'visitors');
  const activeQuery = query(
    visitorsRef,
    orderByChild('lastActive'),
    startAt(fiveMinutesAgo)
  );
  
  onValue(activeQuery, (snapshot) => {
    const visitors = snapshot.val();
    const count = visitors ? Object.keys(visitors).length : 0;
    callback(count);
  });
};