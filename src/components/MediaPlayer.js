import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MediaPlayer = ({ item, isOpen, onClose, onShowSubscription }) => {
  const { isAuthenticated, isSubscribed } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [isPreview, setIsPreview] = useState(false);
  const [showSubscriptionMessage, setShowSubscriptionMessage] = useState(false);
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && item) {
      // Reset all states
      setTimeRemaining(10);
      setShowSubscriptionMessage(false);
      
      // Determine if this should be a preview
      const shouldPreview = item.isIntro || (!isAuthenticated || !isSubscribed);
      setIsPreview(shouldPreview);
      
      if (shouldPreview) {
        // Start the countdown immediately
        startCountdown();
        // Also set a backup timer
        startSubscriptionTimer();
      }
    } else {
      // Clear timers when modal closes
      clearTimers();
    }

    return () => {
      clearTimers();
    };
  }, [isOpen, item?.id]); // Only depend on isOpen and item.id

  const startCountdown = () => {
    // Clear any existing countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    countdownRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          handlePreviewEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSubscriptionTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      if (!isSubscribed) {
        handlePreviewEnd();
      }
    }, 10000);
  };

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const handlePreviewEnd = () => {
    setShowSubscriptionMessage(true);
    clearTimers();
    
    // Pause video/audio
    if (playerRef.current) {
      if (item.type === 'video') {
        try {
          playerRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (e) {
          console.error('Could not pause video:', e);
        }
      } else {
        playerRef.current.pause();
      }
    }
  };

  const handleSubscribe = () => {
    onShowSubscription();
  };

  const handleMaybeLater = () => {
    onClose();
    setShowSubscriptionMessage(false);
    setTimeRemaining(10);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="relative">
          {showSubscriptionMessage ? (
            <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-white text-center p-8">
              <div>
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold mb-2">Free Preview Ended</h3>
                <p className="text-lg mb-4">You've watched 10 seconds of this content.</p>
                <div className="space-y-3">
                  {/* Removed Subscribe to Continue button */}
                  <button 
                    onClick={handleMaybeLater}
                    className="text-gray-400 hover:text-white text-sm block mx-auto"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {item.type === 'video' ? (
                <iframe
                  ref={playerRef}
                  src={`${item.src}&autoplay=1&mute=1&rel=0&showinfo=0&enablejsapi=1&origin=${window.location.origin}`}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <audio
                  ref={playerRef}
                  src={item.src}
                  controls
                  autoPlay
                  className="w-full"
                />
              )}
              
              {/* Countdown overlay for preview */}
              {isPreview && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {timeRemaining}
                    </div>
                    <div className="text-xs">seconds left</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center space-x-1">
              <Clock size={16} />
              <span>Duration: {item.duration}</span>
            </span>
            {isPreview && !showSubscriptionMessage && (
              <span className={`font-semibold flex items-center space-x-1 ${
                timeRemaining <= 3 ? 'text-red-600' : 'text-orange-600'
              }`}>
                <AlertTriangle size={16} />
                <span>Free preview: {timeRemaining}s remaining</span>
              </span>
            )}
            {showSubscriptionMessage && (
              <span className="font-semibold text-red-600 flex items-center space-x-1">
                <AlertTriangle size={16} />
                <span>Preview ended - Subscribe to continue</span>
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm">{item.description}</p>
          {isPreview && !showSubscriptionMessage && (
            <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded text-sm text-orange-800 flex items-center space-x-2">
              <AlertTriangle size={16} />
              <span>This content will automatically stop after 10 seconds. Subscribe to watch the full content.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer; 