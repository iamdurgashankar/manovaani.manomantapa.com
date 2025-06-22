import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, activeFilter, onFilterChange, onTestPopup }) => {
  return (
    <div className="bg-white shadow-sm border-b px-4 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="text-gray-500" size={20} />
          <button 
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded transition-colors ${
              activeFilter === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => onFilterChange('video')}
            className={`px-4 py-2 rounded transition-colors ${
              activeFilter === 'video' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Video
          </button>
          <button 
            onClick={() => onFilterChange('audio')}
            className={`px-4 py-2 rounded transition-colors ${
              activeFilter === 'audio' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Audio
          </button>
          <button 
            onClick={onTestPopup}
            className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 