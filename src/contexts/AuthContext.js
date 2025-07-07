import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Always use production backend
const BACKEND_URL = 'https://manovaani.manomantapa.com/backend-otp';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem('manomantapa_watched_videos');
    return saved ? JSON.parse(saved) : [];
  });

  // Add subscriptionPlan state
  const [subscriptionPlan, setSubscriptionPlan] = useState(() => {
    if (currentUser && currentUser.subscription_plan) return currentUser.subscription_plan;
    const savedUser = localStorage.getItem('manomantapa_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.subscription_plan || null;
    }
    return null;
  });

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('manomantapa_user');
    const savedSubscription = localStorage.getItem('manomantapa_subscription');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    
    if (savedSubscription) {
      setIsSubscribed(JSON.parse(savedSubscription));
    }
    
    setLoading(false);
  }, []);

  // When currentUser changes, update subscriptionPlan
  useEffect(() => {
    if (currentUser && currentUser.subscription_plan) {
      setSubscriptionPlan(currentUser.subscription_plan);
    }
  }, [currentUser]);

  // Track watched videos in localStorage
  const addWatchedVideo = (videoId) => {
    setWatchedVideos(prev => {
      if (!prev.includes(videoId)) {
        const updated = [...prev, videoId];
        localStorage.setItem('manomantapa_watched_videos', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const resetWatchedVideos = () => {
    setWatchedVideos([]);
    localStorage.removeItem('manomantapa_watched_videos');
  };

  // Sign in with Google or Email/Password
  // userObj should be the user object from Firebase Auth (with email, name, uid, etc.)
  const signIn = async (userObj) => {
    try {
      // Try to get user from backend by email
      const response = await axios.get(`${BACKEND_URL}/get-user?email=${encodeURIComponent(userObj.email)}`);
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('manomantapa_user', JSON.stringify(user));
        return { success: true, user };
      } else {
        // If not found, create user in backend
        return await signUp(userObj);
      }
    } catch (error) {
      // If user not found, create user in backend
      if (error.response && error.response.status === 404) {
        return await signUp(userObj);
      }
      const serverMessage = error.response?.data?.message || error.message;
      return { success: false, error: `Server error: ${serverMessage}` };
    }
  };

  // Sign up with Google or Email/Password
  // userObj should be the user object from Firebase Auth (with email, name, uid, etc.)
  const signUp = async (userObj) => {
    try {
      const payload = {
        email: userObj.email,
        name: userObj.displayName || userObj.name || '',
        googleId: userObj.providerId === 'google.com' ? userObj.uid : undefined,
      };
      const response = await axios.post(`${BACKEND_URL}/create-user.php`, payload);
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('manomantapa_user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: response.data.message || 'Failed to create user.' };
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.message;
      return { success: false, error: `Server error: ${serverMessage}` };
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsSubscribed(false);
    localStorage.removeItem('manomantapa_user');
    localStorage.removeItem('manomantapa_subscription');
  };

  // Update user profile (by email)
  const updateUser = async (userData) => {
    if (!currentUser) return { success: false, error: 'No user is signed in.' };
    try {
      const dataToUpdate = {
        email: currentUser.email,
        name: userData.name,
      };
      const response = await axios.post(`${BACKEND_URL}/update-user`, dataToUpdate);
      if (response.data.success) {
        const updatedUser = response.data.user;
        setCurrentUser(updatedUser);
        localStorage.setItem('manomantapa_user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, error: response.data.message || 'Update failed on server.' };
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.message;
      return { success: false, error: `Server error: ${serverMessage}` };
    }
  };

  const updateSubscriptionStatus = (newUserData) => {
    setCurrentUser(newUserData);
    setIsSubscribed(newUserData.isSubscribed);
    localStorage.setItem('manomantapa_user', JSON.stringify(newUserData));
  };

  const updateSubscription = (subscribed) => {
    setIsSubscribed(subscribed);
    localStorage.setItem('manomantapa_subscription', JSON.stringify(subscribed));
  };

  const value = {
    currentUser,
    isAuthenticated,
    isSubscribed,
    subscriptionPlan,
    watchedVideos,
    addWatchedVideo,
    resetWatchedVideos,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
    updateSubscriptionStatus,
    updateSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 