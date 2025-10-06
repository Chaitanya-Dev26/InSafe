// Google Maps API configuration for Vite
// Make sure to prefix your env variables with VITE_ in your .env file
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Debug log
console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Key found' : 'Key not found');
