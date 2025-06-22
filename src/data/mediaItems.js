export const mediaItems = [
    { 
        id: 1,
        title: "Intro Video", 
        type: "video", 
        src: "https://www.youtube.com/embed/ljfdGYlcA_M?enablejsapi=1",
        thumbnail: "https://img.youtube.com/vi/ljfdGYlcA_M/maxresdefault.jpg",
        duration: "3:45",
        description: "Introduction to our media library and services",
        isIntro: true
    },
    { 
        id: 2,
        title: "Therapy Session", 
        type: "video", 
        src: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "5:20",
        description: "Complete therapy session with guided meditation",
        isIntro: false
    },
    { 
        id: 3,
        title: "Morning Meditation", 
        type: "video", 
        src: "https://www.youtube.com/embed/jNQXAC9IVRw?enablejsapi=1",
        thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
        duration: "8:15",
        description: "Start your day with this peaceful morning meditation",
        isIntro: false
    },
    { 
        id: 4,
        title: "Yoga Session", 
        type: "video", 
        src: "https://www.youtube.com/embed/9bZkp7q19f0?enablejsapi=1",
        thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
        duration: "12:30",
        description: "Complete yoga session for beginners",
        isIntro: false
    },
    { 
        id: 5,
        title: "Healing Audio", 
        type: "audio", 
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=225&fit=crop",
        duration: "4:30",
        description: "Relaxing healing audio for meditation",
        isIntro: false
    },
    { 
        id: 6,
        title: "Stress Relief Audio", 
        type: "audio", 
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=225&fit=crop",
        duration: "6:45",
        description: "Calming audio to help relieve stress and anxiety",
        isIntro: false
    }
];

export const subscriptionPlans = [
    {
        id: 'basic',
        name: 'Basic',
        price: '₹99',
        period: 'month',
        features: ['Access to all videos', 'Basic support', 'HD quality']
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '₹499',
        period: 'month',
        features: ['Access to all videos and audio', 'Priority support', '4K quality', 'Download access']
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '₹999',
        period: 'month',
        features: ['Everything in Pro', 'Live sessions', 'Personal consultation', 'Exclusive content']
    }
]; 