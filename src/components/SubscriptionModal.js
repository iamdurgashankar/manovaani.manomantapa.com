import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://manovaani.manomantapa.com/backend-otp";

const planDescriptions = {
  "2": "Access up to 2 videos. Perfect for quick learners or those who want a taste!",
  "4": "Enjoy up to 4 videos. Great for casual viewers who want a bit more.",
  "6": "Watch up to 6 videos. Ideal for regular users who want more content.",
  "8": "Unlock up to 8 videos. Best for enthusiasts who love variety.",
  "unlimited": "Unlimited access to all videos! The ultimate experience for true fans.",
};

const subscriptionPlans = [
  { label: "2 Videos", value: "2" },
  { label: "4 Videos", value: "4" },
  { label: "6 Videos", value: "6" },
  { label: "8 Videos", value: "8" },
  { label: "Unlimited", value: "unlimited" },
];

const SubscriptionModal = ({ userEmail, onClose, onSubscribed, isOpen }) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  if (!isOpen) return null;

  // Placeholder for payment logic
  const handlePaymentAndSubscribe = async () => {
    setLoading(true);
    setMessage("");
    try {
      // TODO: Integrate payment gateway here (e.g., Razorpay, Stripe, etc.)
      // If payment is successful, then proceed to subscribe:
      const res = await axios.post(`${BACKEND_URL}/subscribe.php`, {
        email: userEmail,
        plan: selectedPlan,
      });
      if (res.data.success) {
        setMessage("Subscription updated!");
        if (onSubscribed) onSubscribed(selectedPlan);
      } else {
        setMessage(res.data.message || "Failed to subscribe.");
      }
    } catch (err) {
      setMessage("Network error.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full relative">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
          Choose Your Subscription Plan
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.value}
              className={`border-2 rounded-xl p-6 flex flex-col items-start transition cursor-pointer bg-orange-50 hover:bg-orange-100 shadow-sm relative w-full h-full ${
                selectedPlan === plan.value
                  ? "border-orange-500 ring-2 ring-orange-300"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedPlan(plan.value)}
            >
              <div className="flex items-center mb-2 w-full">
                <span className="text-xl font-bold text-orange-700 mr-2">
                  {plan.label}
                </span>
                {selectedPlan === plan.value && (
                  <span className="ml-auto text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-base mb-4">
                {planDescriptions[plan.value]}
              </p>
              <button
                className={`mt-auto w-full py-2 rounded-lg text-white font-semibold transition-all text-base ${
                  selectedPlan === plan.value
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={selectedPlan !== plan.value || loading}
                onClick={e => {
                  e.stopPropagation();
                  handlePaymentAndSubscribe();
                }}
              >
                {loading && selectedPlan === plan.value
                  ? "Processing..."
                  : selectedPlan === plan.value
                  ? `Subscribe to ${plan.label}`
                  : "Select to Subscribe"}
              </button>
            </div>
          ))}
        </div>
        {message && (
          <div className="mb-2 text-center text-sm text-gray-700">{message}</div>
        )}
        <button
          className="mt-2 w-full text-gray-500 hover:text-gray-700 text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal; 