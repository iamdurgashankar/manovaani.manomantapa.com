import React from 'react';
import AuthForm from './AuthForm';

const AuthModal = ({ isOpen, onClose, mode = 'signin' }) => {
  if (!isOpen) return null;

  return (
    <div className="auth-modal active" onClick={onClose}>
      <div className="auth-form bg-white rounded-xl p-8 w-full max-w-md text-center shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-2">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin'
              ? 'Sign in with your email and password.'
              : 'Create your account to access premium content.'}
          </p>
        </div>
        <AuthForm onAuthSuccess={onClose} mode={mode} />
        <div className="mt-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 