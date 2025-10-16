import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface MapProps {
  className?: string;
  style?: React.CSSProperties;
  isMobile?: boolean;
}

const Map: React.FC<MapProps> = ({ className, style, isMobile = false }) => {

  const mapDetails = {
    id: 1,
    name: 'TSA Pasig',
    lat: 14.563692563429464,
    lng: 121.0719296694467
  };
  // 14.563692563429464, 121.0719296944467

  const mapCenter = {
    lat: 14.563692563429464,
    lng: 121.07192966944467
  };

  const mapContainerStyle = {
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    overflow: 'hidden',
    ...style,
 };

  const center = mapCenter;

  const options = {
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  // Only load Google Maps API when not on mobile
  const { isLoaded } = !isMobile ? useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  }) : { isLoaded: false };

  // Static map URL for mobile devices
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=15&size=${Math.round(style?.width ? parseInt(style.width.toString()) : 400)}x${Math.round(style?.height ? parseInt(style.height.toString()) : 400)}&markers=color:red%7Clabel:S%7C${mapCenter.lat},${mapCenter.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}`;

  if (isMobile) {
    // Return static map for mobile
    return (
      <div className={className}>
        <img 
          src={staticMapUrl} 
          alt="Location map" 
          className="w-full h-full rounded-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={17}
          options={options}
        >
          {/* Marker for VST ECS Manila */}
          <Marker
            key={mapDetails.id}
            position={{ lat: mapDetails.lat, lng: mapDetails.lng }}
            title={mapDetails.name}
          />
        </GoogleMap>
      ) : (
        <div
          className={`flex items-center justify-center bg-gray-200 rounded-full ${style?.width ? '' : 'w-[400px] h-[400px]'}`}
          style={style}
        >
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default Map;