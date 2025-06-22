import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MediaCard from './components/MediaCard';
import MediaPlayer from './components/MediaPlayer';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import Footer from './components/Footer';
import ProfileModal from './components/ProfileModal';
import { mediaItems } from './data/mediaItems';

const AppContent = () => {
  const { isAuthenticated, isSubscribed, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState(mediaItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Filter media items based on search and filter
  useEffect(() => {
    let filtered = mediaItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
    setFilteredItems(filtered);
  }, [searchTerm, activeFilter]);

  const handleMediaClick = (item) => {
    // For intro video, allow 10 seconds preview without authentication
    if (item.isIntro) {
      setSelectedItem(item);
      setIsPlayerOpen(true);
      return;
    }
    
    // For other videos, check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please sign in to watch premium videos');
      setAuthMode('signin');
      setIsAuthModalOpen(true);
      return;
    }

    // For other videos, check subscription
    if (!isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    
    setSelectedItem(item);
    setIsPlayerOpen(true);
  };

  const handleShowSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleShowSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleShowUserProfile = () => {
    if (currentUser) {
      toast.success(`User Profile:\nName: ${currentUser.name}\nEmail: ${currentUser.email}\nSubscription: ${isSubscribed ? 'Active' : 'Inactive'}`);
    }
  };

  const handleShowProfile = () => {
    setIsProfileModalOpen(true);
  };

  const handleTestPopup = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedItem(null);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleCloseSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
  };

  const handleSubscriptionSuccess = () => {
    // Resume video playback if needed
    setIsPlayerOpen(false);
    setSelectedItem(null);
  };

  const handleShowSubscriptionFromPlayer = () => {
    setIsSubscriptionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onShowSignIn={handleShowSignIn}
        onShowSignUp={handleShowSignUp}
        onShowProfile={handleShowProfile}
      />
      
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onTestPopup={handleTestPopup}
      />
      
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MediaCard 
                key={item.id}
                item={item}
                onClick={handleMediaClick}
              />
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No content found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Modals */}
      <MediaPlayer 
        item={selectedItem}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
        onShowSubscription={handleShowSubscriptionFromPlayer}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={handleCloseAuthModal}
      />
      
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen}
        onClose={handleCloseSubscriptionModal}
        onSubscribe={handleSubscriptionSuccess}
        onShowSignIn={handleShowSignIn}
        onShowSignUp={handleShowSignUp}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 