import React from "react";
import { Play, Clock, Video, Music } from "lucide-react";

const MediaCard = ({ item, onClick, onQuickView }) => {
  const getTypeIcon = () => {
    return item.type === "video" ? <Video size={16} /> : <Music size={16} />;
  };

  const getTypeText = () => {
    return item.type === "video" ? "Video" : "Audio";
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick(item);
    }
  };

  return (
    <div
      className="video-card group bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-400 transition-all duration-200 focus-within:border-orange-500 relative"
      tabIndex={0}
      aria-label={`Play ${item.title}`}
      onClick={() => onClick(item)}
      onKeyDown={handleKeyDown}
    >
      <div className="relative">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x225/cccccc/666666?text=No+Thumbnail";
          }}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            className="flex flex-col items-center justify-center focus:outline-none"
            tabIndex={-1}
            aria-label={`Play ${item.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onClick(item);
            }}
          >
            <Play size={48} fill="white" className="drop-shadow-lg mb-2" />
            <span className="text-white text-lg font-semibold">Play</span>
          </button>
          <div className="flex items-center space-x-3 mt-4">
            <span className="flex items-center text-white text-sm bg-black bg-opacity-40 px-2 py-1 rounded">
              <Clock size={14} className="mr-1" />
              {item.duration}
            </span>
            <span className="flex items-center text-white text-sm bg-black bg-opacity-40 px-2 py-1 rounded">
              {getTypeIcon()}
              <span className="ml-1">{getTypeText()}</span>
            </span>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm shadow focus:outline-none"
            tabIndex={-1}
            aria-label={`Quick view ${item.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(item);
            }}
          >
            Quick View
          </button>
        </div>
        {/* Badges */}
        {item.isIntro && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white animate-pulse z-10">
            FREE PREVIEW
          </div>
        )}
        {item.new && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white z-10">
            NEW
          </div>
        )}
        {item.popular && (
          <div className="absolute bottom-2 left-2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white z-10">
            POPULAR
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-lg group-hover:text-orange-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 group-hover:line-clamp-none group-hover:text-gray-800 transition-all">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500 flex items-center space-x-1">
            {getTypeIcon()}
            <span>{getTypeText()}</span>
          </span>
          {item.isIntro && (
            <span className="text-xs text-orange-600 font-medium">
              Free for 10s
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
