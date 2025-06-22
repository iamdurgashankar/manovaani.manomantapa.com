# Manomantapa Media Library - React WebApp

A modern React-based media library application for Manomantapa Trust, featuring user authentication, subscription management, and media playback with preview functionality.

## 🚀 Features

### Core Functionality
- **Media Library**: Browse videos and audio content with beautiful cards
- **Search & Filter**: Search by title/description and filter by content type
- **User Authentication**: Sign up, sign in, and user profile management
- **Subscription System**: Multiple subscription plans with payment integration
- **Preview System**: 10-second free preview for intro content
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Technical Features
- **React 18**: Modern React with hooks and functional components
- **Context API**: Global state management for authentication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful icons throughout the interface
- **React Hot Toast**: Elegant notifications and feedback
- **Local Storage**: Persistent user sessions and preferences

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd manomantapa-media-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Navigation and auth buttons
│   ├── SearchBar.js    # Search and filter functionality
│   ├── MediaCard.js    # Individual media item cards
│   ├── MediaPlayer.js  # Video/audio player with preview logic
│   ├── AuthModal.js    # Sign in/sign up forms
│   ├── SubscriptionModal.js # Subscription plans and payment
│   └── Footer.js       # Contact information and links
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── data/              # Static data
│   └── mediaItems.js  # Media content and subscription plans
├── App.js             # Main application component
├── index.js           # React entry point
└── index.css          # Global styles and Tailwind imports
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for any API keys or configuration:

```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

### Customization
- **Media Content**: Edit `src/data/mediaItems.js` to add/remove content
- **Subscription Plans**: Modify subscription plans in the same file
- **Styling**: Customize colors and themes in `tailwind.config.js`
- **Authentication**: Replace the mock auth in `AuthContext.js` with real backend integration

## 🎯 Usage

### For Users
1. **Browse Content**: View all available videos and audio
2. **Free Preview**: Watch intro content for 10 seconds
3. **Sign Up**: Create an account to access premium content
4. **Subscribe**: Choose a subscription plan to unlock full access
5. **Search & Filter**: Find specific content using search and filters

### For Developers
1. **Add Content**: Add new media items to `mediaItems.js`
2. **Customize UI**: Modify components in the `components/` directory
3. **Extend Features**: Add new functionality using React patterns
4. **Backend Integration**: Replace mock auth with real authentication

## 🔒 Authentication & Security

### Current Implementation
- **Local Storage**: User sessions persist across browser sessions
- **Mock Authentication**: Simulated login/signup for demo purposes
- **Subscription State**: Tracks subscription status locally

### Production Recommendations
- **Backend API**: Implement proper user authentication
- **JWT Tokens**: Secure token-based authentication
- **Database**: Store user data and subscription information
- **Payment Gateway**: Integrate with Stripe, PayPal, or similar
- **HTTPS**: Ensure secure connections in production

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with grid layouts
- **Tablet**: Adaptive layouts with touch-friendly interactions
- **Mobile**: Mobile-first design with optimized navigation

## 🎨 Customization

### Colors
The app uses a custom orange theme. To change colors:
1. Edit `tailwind.config.js` color definitions
2. Update component classes to use new colors
3. Modify CSS variables in `index.css`

### Content
To add or modify media content:
1. Edit `src/data/mediaItems.js`
2. Add new items following the existing structure
3. Update subscription plans as needed

### Styling
- **Tailwind CSS**: Use utility classes for styling
- **Custom CSS**: Add custom styles in `index.css`
- **Component Styling**: Style individual components as needed

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **Firebase Hosting**: Deploy using Firebase CLI

## 🔧 Development

### Available Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App

### Code Style
- **ESLint**: Configured for React best practices
- **Prettier**: Code formatting (recommended)
- **Components**: Functional components with hooks
- **Props**: Use prop-types for type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- **Phone**: 9481087324
- **Email**: Manomantapa2008@gmail.com
- **Organization**: Manomantapa Trust (R)

## 🔮 Future Enhancements

- **Real-time Features**: Live streaming and chat
- **Advanced Analytics**: User behavior tracking
- **Content Management**: Admin panel for content management
- **Mobile App**: React Native companion app
- **Offline Support**: Service workers for offline viewing
- **Social Features**: Comments, likes, and sharing
- **AI Recommendations**: Personalized content suggestions

---

**Built with ❤️ for Manomantapa Trust** 