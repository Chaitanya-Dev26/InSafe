import { useEffect, useState } from "react";
import { Settings, MapPin, Megaphone, Phone, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { auth } from "@/firebase/config";
import { User } from "firebase/auth";
import { useGeolocation, formatLocation } from "@/hooks/useGeolocation";
import { LocationMap } from "@/components/Map";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const location = useGeolocation();
  
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Hello {user?.displayName || 'User'},
            </h1>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              {location.loading ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              )}
              <span className="truncate max-w-[200px]" title={formatLocation(location)}>
                {formatLocation(location)}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/settings")}
          className="w-14 h-14 rounded-full border-2"
        >
          <Settings className="w-8 h-8" />
        </Button>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative rounded-2xl overflow-hidden mb-6 bg-muted">
        <LocationMap 
          lat={location.lat} 
          lng={location.lng} 
          className="h-full min-h-[300px]"
        />
        
        {/* Geofence Circle Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-4 border-primary/60 pointer-events-none" />
        
        {/* Custom Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative">
            <img 
              src={logo} 
              alt="Your location" 
              className="w-16 h-16 drop-shadow-lg"
            />
            {location.loading && (
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-1">Quick Actions</h2>
        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => navigate('/medical-help')}
            className="bg-card hover:bg-accent/10 transition-colors rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-border"
          >
            <img src={logo} alt="InSafe Network" className="w-12 h-12" />
            <span className="text-sm font-semibold text-foreground">Medical<br/>Help</span>
          </button>
          
          <button className="bg-card hover:bg-accent/10 transition-colors rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-border relative">
            <div className="relative">
              <Phone className="w-12 h-12 text-accent" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-background rounded-full flex items-center justify-center border-2">
                <span className="text-destructive text-xs font-bold">×</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-foreground">Safety<br/>Emergency</span>
          </button>

          <button 
            onClick={() => navigate('/lost-and-found')}
            className="bg-card hover:bg-accent/10 transition-colors rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-border"
          >
            <MicOff className="w-12 h-12 text-secondary" />
            <span className="text-sm font-semibold text-foreground">Lost &<br/>Found</span>
          </button>
        </div>

        {/* Primary SOS Button */}
        <Button 
          className="w-full h-16 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full"
          onClick={() => navigate('/sos-emergency')}
        >
          <Megaphone className="mr-2" style={{ width: '32px', height: '32px' }} />
          SOS
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
