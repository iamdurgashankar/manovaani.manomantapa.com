import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
    }
  }, [currentUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateUser({ name });
    if (result.success) {
      toast.success('Profile updated successfully!');
      onClose();
    } else {
      toast.error(result.error || 'Failed to update profile.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal active" onClick={onClose}>
      <div className="auth-form bg-white rounded-xl p-8 w-full max-w-md text-center shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-2">
            Edit Profile
          </h2>
          <p className="text-gray-600">
            Update your account details below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="relative">
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone Number" 
              readOnly
              disabled
              value={currentUser?.phone || ''}
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-orange-500 text-white w-full py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="mt-4">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 