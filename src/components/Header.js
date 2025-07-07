import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, LogIn, UserPlus, Edit, DollarSign } from 'lucide-react';

const Header = ({ onShowSignIn, onShowSignUp, onShowProfile, onShowSubscribe }) => {
  const { currentUser, isAuthenticated, signOut } = useAuth();

  // Profile is considered complete if user has a name and email
  const isProfileComplete = isAuthenticated && currentUser && currentUser.name && currentUser.email;

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 px-4 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Manomantapa Media Library</h1>
        <p className="text-lg">Explore videos and audios — Free for the first 10 seconds</p>
      </div>
      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <>
            <button 
              onClick={onShowSignIn}
              className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button 
              onClick={onShowSignUp}
              className="bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-800 transition-colors flex items-center space-x-2 shadow"
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </button>
          </>
        ) : (
          <>
            {isProfileComplete && (
              <button
                onClick={onShowSubscribe}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 shadow"
              >
                <DollarSign size={16} />
                <span>Subscribe</span>
              </button>
            )}
            <div className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 shadow">
              <User size={16} />
              <span>Welcome, {currentUser?.name || 'User'}</span>
            </div>
            <button 
              onClick={onShowProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow"
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
            <button 
              onClick={signOut}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2 shadow"
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