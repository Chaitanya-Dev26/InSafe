import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { Loader2 } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';

interface MapProps {
  lat: number | null;
  lng: number | null;
  zoom?: number;
  className?: string;
}

const MapContent = ({ lat, lng, zoom = 14 }: { lat: number; lng: number; zoom?: number }) => {
  const map = useMap();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (map) {
      setMapReady(true);
    }
  }, [map]);

  if (!mapReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Map
        zoom={zoom}
        center={{ lat, lng }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        style={{ width: '100%', height: '100%' }}
      >
        <Marker position={{ lat, lng }} />
      </Map>
    </div>
  );
};

export const LocationMap = ({ lat, lng, zoom, className = 'h-64' }: MapProps) => {
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4`}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Please add your Google Maps API key in <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">.env.local</code>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Get one from: <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (lat === null || lng === null) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <MapContent lat={lat} lng={lng} zoom={zoom} />
      </APIProvider>
    </div>
  );
};
