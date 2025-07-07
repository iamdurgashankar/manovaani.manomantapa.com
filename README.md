# Manomantapa Media Library

A modern React-based media library for Manomantapa Trust, featuring secure Google/email authentication, MySQL backend, and a flexible subscription system.

## 🚀 Features
- **Media Library**: Browse and play videos and audio content
- **Search & Filter**: Find content by title, description, or type
- **User Authentication**: Google and email/password login via Firebase
- **Subscription System**: 5 plans (2, 4, 6, 8, unlimited videos)
- **Preview System**: 10-second free preview for intro content
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Production-Ready Backend**: PHP + MySQL, deployed on cPanel

## 🏗️ Project Structure
```
Manomantapa-media-page/
├── backend-otp/           # PHP backend (MySQL, user management, subscriptions)
├── public/
├── src/
│   ├── components/        # React components (UI, modals, player)
│   ├── contexts/          # AuthContext (global auth/subscription state)
│   ├── data/              # mediaItems.js (media content)
│   ├── firebase.js        # Firebase config (Google/email auth)
│   ├── App.js             # Main app logic
│   └── index.js, index.css
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS config
└── README.md
```

## ⚡ Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Manomantapa-media-page
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Firebase**
   - Update `src/firebase.js` with your Firebase project config (Google sign-in enabled).
4. **Start the development server**
   ```bash
   npm start
   ```
5. **Open your browser**
   Go to [http://localhost:3000](http://localhost:3000)

## 🔑 Authentication
- **Google Sign-In**: One-click login with Google
- **Email/Password**: Standard email registration/login
- **Backend**: All users are stored in MySQL (see backend-otp/)
- **No phone/OTP**: All phone/Twilio logic has been removed

## 💳 Subscription System
- **Plans**: 2, 4, 6, 8, or unlimited videos
- **Modal**: User-friendly modal appears only when user clicks 'Subscribe' after login
- **Limits**: Watched videos tracked per user/plan
- **Upgrade**: Users can upgrade at any time
- **Payment**: Payment logic is ready for integration (see below)

## 🛠️ Payment Integration
- The code includes a placeholder for payment gateway integration (e.g., Razorpay, Stripe) in `SubscriptionModal.js`.
- To enable payments, add your payment logic in the `handlePaymentAndSubscribe` function.

## 🗄️ Backend (PHP + MySQL)
- **Location**: `backend-otp/` (see `README-PHP.md` for setup)
- **Endpoints**: `/get-user`, `/create-user.php`, `/update-user`, `/subscribe.php`
- **CORS**: Configured for production domain only
- **Database**: MySQL table for users and subscriptions
- **Deployment**: Upload to cPanel, configure database, set permissions

## 📦 Main Dependencies
- **React 18**
- **Firebase** (auth)
- **Axios** (API requests)
- **Tailwind CSS** (styling)
- **Lucide React** (icons)
- **React Hot Toast** (notifications)
- **react-youtube** (video player)

## 📜 Scripts
- `npm start` — Start development server
- `npm run build` — Build for production
- `npm test` — Run tests
- `npm run eject` — Eject from Create React App

## 📝 Customization
- **Media Content**: Edit `src/data/mediaItems.js`
- **Subscription Plans**: Edit `SubscriptionModal.js` for plan options
- **Styling**: Update `tailwind.config.js` and component classes

## 🚀 Deployment
- **Frontend**: Build and deploy with Netlify, Vercel, Firebase Hosting, or cPanel static hosting
- **Backend**: Deploy PHP files to cPanel, configure MySQL, set CORS for your domain
- See `DEPLOYMENT.md` for detailed instructions

## 🤝 Support & Contact
- **Email**: Manomantapa2008@gmail.com
- **Phone**: 9481087324
- **Organization**: Manomantapa Trust (R)

---
**Built with ❤️ for Manomantapa Trust** 