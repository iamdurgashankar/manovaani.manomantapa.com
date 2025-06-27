import React, { useState } from 'react';
import { X, User, Smartphone, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

// Use environment variable for backend URL, fallback to current value for local/dev
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://manovaani.manomantapa.com/backend-otp'; // Use env var in production

const AuthModal = ({ isOpen, mode, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', otp: '' });
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${BACKEND_URL}/send-otp`, { phone: formData.phone });
      setStep('otp');
      toast.success('OTP sent to your phone!');
    } catch (err) {
      let errorMessage = 'Failed to send OTP';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Please make sure the backend server is running on port 5000';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error: Please check your Twilio credentials in the .env file';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        phone: formData.phone,
        otp: formData.otp,
      };

      if (mode === 'signup') {
        payload.name = formData.name;
      }
      
      // First, verify the OTP. The backend will create the user if they don't exist.
      await axios.post(`${BACKEND_URL}/verify-otp`, payload);
      
      // Now that OTP is verified and user exists on backend, sign in to fetch their data
      const result = await signIn(formData.phone);
      
      if (result.success) {
        toast.success(mode === 'signin' ? 'Successfully signed in!' : 'Account created successfully!');
        onClose();
        setFormData({ name: '', phone: '', otp: '' });
        setStep('phone');
      } else {
        setError(result.error || 'Authentication failed after OTP verification.');
        toast.error(result.error || 'Authentication failed after OTP verification.');
      }
    } catch (err) {
      let errorMessage = 'Failed to verify OTP';
      if(err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '', otp: '' });
    setStep('phone');
    setLoading(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal active" onClick={handleClose}>
      <div className="auth-form bg-white rounded-xl p-8 w-full max-w-md text-center shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-2">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'Sign in with your phone number and OTP.' 
              : 'Create your account to access premium content.'
            }
          </p>
        </div>
        {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            )}
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone Number" 
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-orange-500 text-white w-full py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                name="otp"
                placeholder="Enter OTP" 
                required
                value={formData.otp}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
                maxLength={6}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-orange-500 text-white w-full py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        <div className="mt-4">
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 