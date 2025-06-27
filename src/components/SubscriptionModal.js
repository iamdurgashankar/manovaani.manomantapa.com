import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable for backend URL, fallback to current value for local/dev
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://manovaani.manomantapa.com/backend-otp'; // Use env var in production
const RAZORPAY_KEY_ID = 'rzp_test_L6upB708x4iE6y';

const SubscriptionModal = ({ isOpen, onClose, onShowSignIn }) => {
  const { currentUser, isAuthenticated, updateSubscriptionStatus } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated || !currentUser) {
      toast.error('You must be signed in to subscribe.');
      onShowSignIn();
      onClose();
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order on the backend
      const orderResponse = await axios.post(`${BACKEND_URL}/create-order`, {
        amount: 50000, // Amount in paise (e.g., 50000 = ₹500)
      });

      const { order } = orderResponse.data;
      if (!order) {
        throw new Error('Could not create order.');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Manomantapa Subscription',
        description: 'One Year Access',
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment on the backend
          try {
            const verificationPayload = {
              phone: currentUser.phone,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };
            
            const verificationResponse = await axios.post(`${BACKEND_URL}/verify-payment`, verificationPayload);

            if (verificationResponse.data.success) {
              toast.success('Subscription successful! Thank you.');
              updateSubscriptionStatus(verificationResponse.data.user);
              onClose();
            } else {
              throw new Error(verificationResponse.data.message || 'Payment verification failed.');
            }
          } catch (verifyError) {
            toast.error(verifyError.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: currentUser.name,
          contact: currentUser.phone,
        },
        notes: {
          address: 'Manomantapa Trust',
        },
        theme: {
          color: '#F97316',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Subscription failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal active" onClick={onClose}>
      <div className="auth-form bg-white rounded-xl p-8 w-full max-w-lg text-center shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-2">
            Unlock Unlimited Access
          </h2>
          <p className="text-gray-600">
            Join our community to enjoy all of our premium spiritual and wellness content.
          </p>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 my-6 text-left">
          <h3 className="font-bold text-lg mb-4 text-gray-800">One Year Plan</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-3" /> Unlimited video streaming</li>
            <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-3" /> Access to all audio content</li>
            <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-3" /> Exclusive member-only content</li>
            <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-3" /> Support spiritual initiatives</li>
          </ul>
          <div className="text-center mt-6">
            <span className="text-4xl font-bold text-orange-600">₹500</span>
            <span className="text-gray-600"> / year</span>
          </div>
        </div>
        
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-orange-500 text-white w-full py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Subscribe Now</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>

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

export default SubscriptionModal; 