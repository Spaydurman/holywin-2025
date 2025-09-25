import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface MapProps {
  className?: string;
  style?: React.CSSProperties;
}

const Map: React.FC<MapProps> = ({ className, style }) => {
  // VST ECS Manila location
  const vstEcsManila = {
    id: 1,
    name: 'VST ECS Manila',
    lat: 14.5995,
    lng: 120.9842
  };

  // Center of the map (Manila)
  const mapCenter = {
    lat: 14.5995,
    lng: 120.9842
  };

  // Radius for the circular map (in meters)
//   const circleRadius = 50000;

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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

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
            key={vstEcsManila.id}
            position={{ lat: vstEcsManila.lat, lng: vstEcsManila.lng }}
            title={vstEcsManila.name}
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