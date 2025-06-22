import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://manovaani.manomantapa.com/backend-otp'; // Make sure this is correct

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

  const signIn = async (phone) => {
    try {
      // After OTP verification, get user data from backend
      const response = await axios.get(`${BACKEND_URL}/get-user?phone=${phone}`);
      
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('manomantapa_user', JSON.stringify(user));
        return { success: true, user };
      } else {
        // This case might happen if user verified but doesn't exist in db, handle as signup
        return signUp('User ' + phone.slice(-4), phone);
      }
    } catch (error) {
      console.error('Full sign-in error:', error);
      if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          // Fallback to signup if user not found
          if (error.response.status === 404) {
              console.log('User not found on backend, attempting to sign up locally.');
              return signUp('User ' + phone.slice(-4), phone);
          }
          const serverMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message;
          return { success: false, error: `Server error: ${serverMessage || 'Failed to fetch user data.'}` };
      } else if (error.request) {
          console.error('Error request:', error.request);
          return { success: false, error: 'No response from server. Please check your network connection and the backend URL.' };
      } else {
          console.error('Error message:', error.message);
          return { success: false, error: 'Failed to connect to the server to sign in.' };
      }
    }
  };

  const signUp = async (name, phone) => {
    try {
      // In a real app, the backend should create the user after OTP verification.
      // Here, we assume the user is created or we create them client-side.
      const user = { name, phone };
      
      // We can also call an endpoint to ensure the user is in the DB.
      // For now, let's just update the client.
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('manomantapa_user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsSubscribed(false);
    localStorage.removeItem('manomantapa_user');
    localStorage.removeItem('manomantapa_subscription');
  };

  const updateUser = async (userData) => {
    if (!currentUser) return { success: false, error: 'No user is signed in.' };
    
    try {
      const dataToUpdate = {
        phone: currentUser.phone,
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
      console.error('Full update user error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        const serverMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message;
        return { success: false, error: `Server error: ${serverMessage || 'Could not update profile.'}` };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        return { success: false, error: 'No response from server. Please check your network connection and the backend URL.' };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        return { success: false, error: 'Failed to connect to the server to update profile.' };
      }
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