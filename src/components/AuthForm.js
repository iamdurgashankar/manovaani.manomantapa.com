import React, { useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile, // <-- Add this import
} from "firebase/auth";
import { firebaseApp } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Lock } from "lucide-react";

// Google SVG Icon
const GoogleIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width={props.size || 20}
    height={props.size || 20}
    {...props}
  >
    <g>
      <path
        fill="#4285F4"
        d="M21.805 10.023h-9.765v3.955h5.627c-.243 1.243-1.486 3.655-5.627 3.655-3.386 0-6.145-2.8-6.145-6.25s2.759-6.25 6.145-6.25c1.927 0 3.222.82 3.965 1.527l2.713-2.638c-1.715-1.6-3.927-2.59-6.678-2.59-5.522 0-10 4.477-10 10s4.478 10 10 10c5.75 0 9.542-4.03 9.542-9.72 0-.654-.07-1.15-.155-1.635z"
      />
      <path
        fill="#34A853"
        d="M3.545 7.548l3.285 2.409c.89-1.7 2.57-2.8 4.465-2.8 1.09 0 2.09.37 2.87 1.09l2.155-2.09c-1.36-1.27-3.09-2.05-5.025-2.05-3.86 0-7 3.14-7 7s3.14 7 7 7c1.935 0 3.665-.78 5.025-2.05l-2.155-2.09c-.78.72-1.78 1.09-2.87 1.09-1.895 0-3.575-1.1-4.465-2.8z"
      />
      <path
        fill="#FBBC05"
        d="M20.452 12.273c0-.41-.037-.82-.11-1.227h-8.302v3.955h4.73c-.205 1.045-1.23 3.045-4.73 3.045-2.72 0-4.945-2.23-4.945-4.995s2.225-4.995 4.945-4.995c1.545 0 2.545.62 3.13 1.18l2.14-2.09c-1.36-1.27-3.09-2.05-5.025-2.05-3.86 0-7 3.14-7 7s3.14 7 7 7c3.8 0 6.945-2.97 6.945-7z"
      />
      <path
        fill="#EA4335"
        d="M12.187 21.545c2.7 0 4.97-.89 6.62-2.43l-3.155-2.59c-.89.6-2.03.95-3.465.95-2.72 0-4.945-2.23-4.945-4.995s2.225-4.995 4.945-4.995c1.545 0 2.545.62 3.13 1.18l2.14-2.09c-1.36-1.27-3.09-2.05-5.025-2.05-3.86 0-7 3.14-7 7s3.14 7 7 7z"
      />
    </g>
  </svg>
);

const AuthForm = ({ onAuthSuccess, mode = "signin" }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const auth = getAuth(firebaseApp);
  const { signIn } = useAuth();

  // --- Google Login ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Pass Firebase user object to AuthContext signIn
      const res = await signIn(result.user);
      if (res.success) {
        setSuccess("Login successful!");
        if (onAuthSuccess) onAuthSuccess(res.user);
      } else {
        // Show backend error message if available
        setError(res.error?.replace("Server error: ", "") || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // --- Email/Password ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let userCredential;
      if (mode === "signup") {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Optionally update displayName
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      // Pass Firebase user object to AuthContext signIn
      const res = await signIn(userCredential.user);
      if (res.success) {
        setSuccess("Login successful!");
        if (onAuthSuccess) onAuthSuccess(res.user);
      } else {
        // Show backend error message if available
        setError(res.error?.replace("Server error: ", "") || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // --- Password Reset ---
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setResetMessage(err.message);
    }
  };

  // --- UI ---
  return (
    <div>
      {showReset && mode === "signin" ? (
        <form onSubmit={handlePasswordReset} className="space-y-4 mb-4">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white w-full py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg"
          >
            Send Password Reset Email
          </button>
          <button
            type="button"
            className="w-full text-gray-500 hover:text-gray-700 text-sm mt-2"
            onClick={() => {
              setShowReset(false);
              setResetMessage("");
            }}
          >
            Back to Sign In
          </button>
          {resetMessage && (
            <div className="mt-2 text-sm text-center text-orange-700">
              {resetMessage}
            </div>
          )}
        </form>
      ) : (
        <>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            )}
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white w-full py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? mode === "signup"
                  ? "Signing up..."
                  : "Signing in..."
                : mode === "signup"
                ? "Sign Up"
                : "Sign In"}
            </button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <div className="flex justify-center mb-2">
            <button
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-red-500 text-white flex items-center justify-center w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <GoogleIcon size={20} className="mr-2" />
              {loading ? "Signing in..." : "Continue with Google"}
            </button>
          </div>
          {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
          {success && (
            <div className="mb-2 text-green-600 text-sm">{success}</div>
          )}
          {mode === "signin" && (
            <div className="text-center mt-2">
              <button
                type="button"
                className="text-orange-600 hover:underline text-sm"
                onClick={() => setShowReset(true)}
              >
                Forgot Password?
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthForm;
