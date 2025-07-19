import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MediaCard from "./components/MediaCard";
import MediaPlayer from "./components/MediaPlayer";
import AuthModal from "./components/AuthModal";
import SubscriptionModal from "./components/SubscriptionModal";
import Footer from "./components/Footer";
import ProfileModal from "./components/ProfileModal";
import { mediaItems } from "./data/mediaItems";
import WelcomeScreen from "./components/WelcomeScreen";

const AppContent = () => {
  const {
    isAuthenticated,
    isSubscribed,
    currentUser,
    subscriptionPlan,
    watchedVideos,
    addWatchedVideo,
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState(mediaItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [quickViewItem, setQuickViewItem] = useState(null);

  // Filter media items based on search and filter
  useEffect(() => {
    let filtered = mediaItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || item.type === activeFilter;
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
      toast.error("Please sign in to watch premium videos");
      setAuthMode("signin");
      setIsAuthModalOpen(true);
      return;
    }

    // For other videos, check subscription
    if (!isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    // Enforce subscription plan limits
    if (subscriptionPlan && subscriptionPlan !== "unlimited") {
      const allowed = parseInt(subscriptionPlan, 10);
      // Only count unique, non-intro videos
      const watchedCount = watchedVideos.length;
      const alreadyWatched = watchedVideos.includes(item.id);
      if (!alreadyWatched && watchedCount >= allowed) {
        toast.error(
          `You have reached your limit of ${allowed} videos for this plan. Upgrade for more access!`
        );
        return;
      }
      // Mark as watched if not already
      if (!alreadyWatched) {
        addWatchedVideo(item.id);
      }
    }
    setSelectedItem(item);
    setIsPlayerOpen(true);
  };

  const handleShowSignIn = () => {
    setAuthMode("signin");
    setIsAuthModalOpen(true);
  };

  const handleShowSignUp = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const handleShowUserProfile = () => {
    if (currentUser) {
      toast.success(
        `User Profile:\nName: ${currentUser.name}\nEmail: ${
          currentUser.email
        }\nSubscription: ${isSubscribed ? "Active" : "Inactive"}`
      );
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

  // Quick View handler
  const handleQuickView = (item) => {
    setQuickViewItem(item);
  };
  const handleCloseQuickView = () => {
    setQuickViewItem(null);
  };

  if (showWelcome) {
    return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fadeIn">
      <Header
        onShowSignIn={handleShowSignIn}
        onShowSignUp={handleShowSignUp}
        onShowProfile={handleShowProfile}
        onShowSubscribe={handleShowSubscriptionFromPlayer}
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
                onQuickView={handleQuickView}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No content found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
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
        userEmail={currentUser?.email}
        onClose={handleCloseSubscriptionModal}
        onSubscribed={handleSubscriptionSuccess}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Quick View Modal */}
      {quickViewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fadeInUp">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-orange-600 text-2xl font-bold focus:outline-none"
              onClick={handleCloseQuickView}
              aria-label="Close quick view"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <div className="relative w-full mb-4">
                <img
                  src={quickViewItem.thumbnail}
                  alt={quickViewItem.title}
                  className="w-full h-56 object-cover rounded-xl border border-gray-200 shadow"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x225/cccccc/666666?text=No+Thumbnail";
                  }}
                />
                {quickViewItem.isIntro && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white animate-pulse z-10">
                    FREE PREVIEW
                  </div>
                )}
                {quickViewItem.new && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white z-10">
                    NEW
                  </div>
                )}
                {quickViewItem.popular && (
                  <div className="absolute bottom-2 left-2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white z-10">
                    POPULAR
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {quickViewItem.title}
              </h2>
              <div className="flex items-center space-x-3 mb-2">
                <span className="flex items-center text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="mr-1"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {quickViewItem.duration}
                </span>
                <span className="flex items-center text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded">
                  {quickViewItem.type === "video" ? "🎥 Video" : "🎧 Audio"}
                </span>
              </div>
              <p className="text-gray-700 text-base text-center mb-4">
                {quickViewItem.description}
              </p>
              <button
                className="mt-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-base shadow focus:outline-none"
                onClick={() => {
                  handleMediaClick(quickViewItem);
                  handleCloseQuickView();
                }}
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
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
