import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../../redux/slices/authSlice';
import { auth, database } from '../../firebase/firebaseConfig';
import { Spinner } from '../ui/Spinner';

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => { // Use direct reference instead of calling as function
      if (firebaseUser) {
        try {
          const db = database; // Use direct reference instead of calling as function
          // Use Promise.all to fetch user data in parallel for better performance
          const [adminSnapshot, userSnapshot] = await Promise.all([
            get(ref(db, `admins/${firebaseUser.uid}`)),
            get(ref(db, `users/${firebaseUser.uid}`))
          ]);
          
          const isAdmin = adminSnapshot.exists();
          const userData = userSnapshot.exists() ? userSnapshot.val() : {};
          
          const user = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData.name || firebaseUser.displayName || 'User',
            role: isAdmin ? 'admin' : 'user',
            photoURL: firebaseUser.photoURL,
          };
          
          dispatch(loginSuccess(user));
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);

  // Show a simple spinner during authentication loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;