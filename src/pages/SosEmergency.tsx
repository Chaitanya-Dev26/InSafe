import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
}

interface User {
  id: number;
  img: string;
  size: 'small' | 'medium' | 'large';
  top: string;
  left: string;
  name: string;
}

interface Dot {
  id: number;
  size: number;
  top: string;
  left: string;
  delay: number;
}

export default function SOSEmergencyCalling() {
  // Simulated nearby users with random positions (moved up by 10%)
  const nearbyUsers: User[] = [
    { id: 1, img: 'https://i.pravatar.cc/150?img=1', size: 'large', top: '20%', left: '50%', name: 'User 1' },
    { id: 2, img: 'https://i.pravatar.cc/150?img=5', size: 'medium', top: '35%', left: '25%', name: 'User 2' },
    { id: 3, img: 'https://i.pravatar.cc/150?img=9', size: 'medium', top: '40%', left: '78%', name: 'User 3' },
    { id: 4, img: 'https://i.pravatar.cc/150?img=12', size: 'medium', top: '55%', left: '12%', name: 'User 4' },
    { id: 5, img: 'https://i.pravatar.cc/150?img=16', size: 'medium', top: '65%', left: '56%', name: 'User 5' },
  ];

  // Animated dots
  const dots = [
    { id: 1, size: 12, top: '43%', left: '10%', delay: 0 },
    { id: 2, size: 8, top: '40%', left: '58%', delay: 0.5 },
    { id: 3, size: 10, top: '72%', left: '35%', delay: 1 },
    { id: 4, size: 8, top: '60%', left: '92%', delay: 1.5 },
  ];

  const getAvatarSize = (size: 'small' | 'medium' | 'large'): string => {
    switch(size) {
      case 'large': return 'w-14 h-14';  // Further reduced from w-20 h-20
      case 'medium': return 'w-12 h-12'; // Reduced from w-16 h-16
      case 'small': 
      default: 
        return 'w-10 h-10';  // Reduced from w-12 h-12
    }
  };

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number | null; lng: number | null; error: string | null }>({ 
    lat: null, 
    lng: null, 
    error: null 
  });

  const navigate = useNavigate();

  // Get user's current location
  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setUserLocation(prev => ({ ...prev, error: 'Geolocation is not supported by your browser' }));
        return;
      }

      const success = (position: GeolocationPosition) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null
        });
      };

      const error = (err: GeolocationPositionError) => {
        console.error('Error getting location:', err);
        setUserLocation(prev => ({
          ...prev,
          error: 'Unable to retrieve your location. Please ensure location services are enabled.'
        }));
      };

      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    };

    getUserLocation();
  }, []);

  // Load emergency contacts from localStorage
  useEffect(() => {
    const loadContacts = () => {
      const savedContacts = localStorage.getItem('emergencyContacts');
      if (savedContacts) {
        const parsedContacts = JSON.parse(savedContacts);
        setEmergencyContacts(parsedContacts);
        
        // If we have location and contacts, start notifying them
        if (parsedContacts.length > 0 && userLocation.lat && userLocation.lng) {
          notifyEmergencyContacts(parsedContacts, userLocation.lat, userLocation.lng);
        } else if (parsedContacts.length === 0) {
          console.log('⚠️ No emergency contacts found. Please add contacts in the Emergency Contacts section.');
        } else if (!userLocation.lat || !userLocation.lng) {
          console.log('⚠️ Waiting for location access...');
        }
      } else {
        console.log('⚠️ No emergency contacts found. Please add contacts in the Emergency Contacts section.');
      }
    };

    loadContacts();
  }, [userLocation.lat, userLocation.lng]);

  // Function to handle emergency notifications
  const notifyEmergencyContacts = (contacts: EmergencyContact[], lat: number, lng: number) => {
    console.log('🚨 EMERGENCY ALERT 🚨');
    console.log(`Found ${contacts.length} emergency contacts to notify`);
    
    if (contacts.length === 0) {
      console.log('No emergency contacts to notify. Please add contacts in the Emergency Contacts section.');
      return;
    }
    
    // Create Google Maps link for the location
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    
    console.log('Sending emergency notifications to contacts:');
    console.log(`📍 Your current location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    console.log(`📍 View on Google Maps: ${mapsLink}`);
    
    contacts.forEach((contact, index) => {
      setTimeout(() => {
        // Simulate API call to notify contact
        console.log(`\n📞 Calling ${contact.name} (${contact.phone})...`);
        console.log(`💬 Message sent: "EMERGENCY! I need help!`);
        console.log(`📍 My current location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        console.log(`📍 Google Maps: ${mapsLink}`);
        console.log(`✅ ${contact.name} notified successfully`);
        
        // If this is the last contact, log completion
        if (index === contacts.length - 1) {
          console.log('\nAll emergency contacts have been notified!');
          console.log('🆘 Stay calm, help is on the way! 🚨');
        }
      }, index * 2000); // Stagger the calls by 2 seconds each
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-14 h-14 rounded-2xl border-2 border-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-white/10 transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
        <h1 className="text-white text-2xl font-bold tracking-wide">SOS</h1>
        <div className="w-14"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 text-center">
        <h2 className="text-white text-4xl font-bold mb-2">
          Emergency Calling...
        </h2>
        <p className="text-white/90 text-lg leading-relaxed max-w-md mx-auto mb-6">
          Your emergency contacts are being notified with your current location.
        </p>
        
        {/* Location Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 max-w-xs mx-auto mb-2">
          <h3 className="text-white font-semibold text-sm mb-1">Your Location:</h3>
          {userLocation.error ? (
            <p className="text-red-300 text-sm">{userLocation.error}</p>
          ) : userLocation.lat && userLocation.lng ? (
            <div className="space-y-2">
              <p className="text-white/90 text-xs">
                🌍 {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </p>
              <a 
                href={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-300 hover:text-blue-100 text-xs mt-1"
              >
                <span>View on Google Maps</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ) : (
            <p className="text-yellow-300 text-xs">Getting location...</p>
          )}
        </div>
      </div>

      {/* Nearby Users with Connecting Lines */}
      <div className="relative h-[500px] -mt-6">
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {nearbyUsers.map((user) => (
            <line
              key={user.id}
              x1="50%"
              y1="25%"
              x2={user.left}
              y2={user.top}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          ))}
        </svg>

        {/* Animated dots */}
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-white/40 animate-pulse"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              top: dot.top,
              left: dot.left,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${dot.delay}s`,
              zIndex: 2,
            }}
          ></div>
        ))}

        {/* User avatars */}
        {nearbyUsers.map((user, index) => (
          <div
            key={user.id}
            className="absolute"
            style={{
              top: user.top,
              left: user.left,
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
            }}
          >
            <div className={`${getAvatarSize(user.size as 'small' | 'medium' | 'large')} rounded-full overflow-hidden border-2 border-white/30 shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
              <img 
                src={user.img} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}

        {/* Center Logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 4 }}>
          <div className="text-center">
            <h3 className="text-white text-5xl font-black tracking-tight mb-1">
              InSafe
            </h3>
            <p className="text-white/80 text-sm font-medium tracking-wide">
              Safety is Freedom
            </p>
          </div>
        </div>
      </div>

      {/* Emergency notification system is active */}

      {/* I'm Safe Now Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-20">
        <button 
          className="w-full bg-gray-900 text-white text-2xl font-bold py-6 rounded-3xl shadow-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
          onClick={() => {
            console.log('\n=== SAFETY CONFIRMATION ===');
            console.log('🆘 Emergency Alert Cancelled - User is Safe!');
            
            // Notify all contacts that the user is safe
            emergencyContacts.forEach((contact, index) => {
              setTimeout(() => {
                console.log(`\n💌 Safety update sent to ${contact.name} (${contact.phone})`);
                console.log(`✅ ${contact.name} has been notified that you are safe`);
                
                if (index === emergencyContacts.length - 1) {
                  console.log('\nAll emergency contacts have been updated about your safety!');
                  console.log('Thank you for using InSafe. Your safety is our priority.\n');
                }
              }, index * 1000);
            });
          }}
        >
          I'm Safe Now
        </button>
      </div>

    </div>
  );
}