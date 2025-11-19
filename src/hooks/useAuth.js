import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  setLoading as setAuthLoading,
  checkAuth as checkAuthAction,
} from '../redux/slices/authSlice';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../firebase/firebaseConfig';
import { ref, get, set } from 'firebase/database';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Check if user is already authenticated
  const checkAuth = useCallback(() => {
    return dispatch(checkAuthAction());
  }, [dispatch]);

  const register = async (userData) => {
    try {
      dispatch(loginStart());
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      const firebaseUser = userCredential.user;
      
      try {
        // Save user data to Firebase Realtime Database
        await set(ref(database, `users/${firebaseUser.uid}`), {
          name: userData.name,
          email: userData.email,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error('Failed to save user data to database:', dbError);
        // Continue with registration even if database save fails
      }
      
      const user = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        role: 'user',
      };
      
      dispatch(loginSuccess(user));
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      }
      
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      dispatch(loginStart());
      
      console.log('Attempting login with:', credentials.email);
      
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const firebaseUser = userCredential.user;
      console.log('Firebase user authenticated:', firebaseUser.uid);
      
      try {
        // Check if user is admin by checking Firebase Realtime Database
        const adminRef = ref(database, `admins/${firebaseUser.uid}`);
        const adminSnapshot = await get(adminRef);
        
        const isAdmin = adminSnapshot.exists();
        console.log('Is admin:', isAdmin);
        
        // Get user data from Firebase Realtime Database
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        const userSnapshot = await get(userRef);
        
        const userData = userSnapshot.exists() ? userSnapshot.val() : {};
        console.log('User data from database:', userData);
        
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name || firebaseUser.displayName || 'User',
          role: isAdmin ? 'admin' : 'user',
          photoURL: firebaseUser.photoURL,
        };
        
        dispatch(loginSuccess(user));
        console.log('Login successful:', user);
        return { success: true, user };
      } catch (dbError) {
        console.error('Database access error:', dbError);
        // Fallback: create minimal user object if database access fails
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          role: 'user', // Default to user role if can't access database
          photoURL: firebaseUser.photoURL,
        };
        
        dispatch(loginSuccess(user));
        console.log('Login successful with fallback:', user);
        return { success: true, user };
      }
    } catch (error) {
      console.error('Login error details:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'PERMISSION_DENIED') {
        errorMessage = 'Access denied. Please contact administrator.';
      }
      
      console.error('Error code:', error.code, 'Message:', errorMessage);
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logoutAction());
    }
  };

  const setLoading = (isLoading) => {
    dispatch(setAuthLoading(isLoading));
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    setLoading,
    checkAuth,
  };
};
