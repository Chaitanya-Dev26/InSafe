import { useState, useEffect } from 'react';

interface Location {
  lat: number | null;
  lng: number | null;
  address: string | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = (): Location => {
  const [location, setLocation] = useState<Location>({
    lat: null,
    lng: null,
    address: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false
      }));
      return;
    }

    const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }
        
        const data = await response.json();
        
        // Try to get a human-readable address
        const address = data.display_name || `${data.address?.city || data.address?.town || data.address?.village || 'Unknown location'}, ${data.address?.country || ''}`;
        return address;
      } catch (error) {
        console.error('Error getting address:', error);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`; // Fallback to coordinates if address lookup fails
      }
    };

    const success = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const address = await getAddressFromCoords(latitude, longitude);
      
      setLocation({
        lat: latitude,
        lng: longitude,
        address,
        error: null,
        loading: false
      });
    };

    const error = (err: GeolocationPositionError) => {
      console.error('Error getting location:', err);
      setLocation({
        lat: null,
        lng: null,
        address: null,
        error: 'Unable to retrieve your location. Please ensure location services are enabled.',
        loading: false
      });
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  }, []);

  return location;
};

export const formatLocation = (location: Location): string => {
  if (location.loading) return 'Getting location...';
  if (location.error) return 'Location unavailable';
  return location.address || `${location.lat?.toFixed(4)}, ${location.lng?.toFixed(4)}`;
};
