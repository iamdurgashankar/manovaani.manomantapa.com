import React from 'react';
import { Play, Clock, Video, Music } from 'lucide-react';

const MediaCard = ({ item, onClick }) => {
  const getTypeIcon = () => {
    return item.type === 'video' ? <Video size={16} /> : <Music size={16} />;
  };

  const getTypeText = () => {
    return item.type === 'video' ? 'Video' : 'Audio';
  };

  return (
    <div 
      className="video-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" 
      onClick={() => onClick(item)}
    >
      <div className="relative">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225/cccccc/666666?text=No+Thumbnail';
          }}
        />
        <div className="play-button">
          <Play size={24} fill="white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
          <Clock size={12} />
          <span>{item.duration}</span>
        </div>
        {item.isIntro && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
            FREE PREVIEW
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center space-x-1">
            {getTypeIcon()}
            <span>{getTypeText()}</span>
          </span>
          {item.isIntro && (
            <span className="text-xs text-orange-600 font-medium">Free for 10s</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard; 