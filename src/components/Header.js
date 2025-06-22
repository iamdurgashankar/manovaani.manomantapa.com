import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, LogIn, UserPlus, Edit } from 'lucide-react';

const Header = ({ onShowSignIn, onShowSignUp, onShowProfile }) => {
  const { currentUser, isAuthenticated, signOut } = useAuth();

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 px-4 text-center">
      <h1 className="text-3xl font-bold">Manomantapa Media Library</h1>
      <p className="text-lg">Explore videos and audios — Free for the first 10 seconds</p>
      
      <div className="mt-4 flex justify-center space-x-4">
        {!isAuthenticated ? (
          <>
            <button 
              onClick={onShowSignIn}
              className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button 
              onClick={onShowSignUp}
              className="bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-800 transition-colors flex items-center space-x-2"
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </button>
          </>
        ) : (
          <>
            <div className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2">
              <User size={16} />
              <span>Welcome, {currentUser?.name || 'User'}</span>
            </div>
            <button 
              onClick={onShowProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
            <button 
              onClick={signOut}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 