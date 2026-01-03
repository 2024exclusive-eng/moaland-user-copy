"use client";

import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";

interface GoogleMapViewProps {
  latitude: number;
  longitude: number;
  address: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export function GoogleMapView({
  latitude,
  longitude,
  address,
}: GoogleMapViewProps) {
  const [loadError, setLoadError] = useState<Error | null>(null);

  const center = useMemo(
    () => ({
      lat: Number(latitude),
      lng: Number(longitude),
    }),
    [latitude, longitude]
  );

  const handleLoadError = useCallback((error: Error) => {
    setLoadError(error);
  }, []);

  if (!API_KEY) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <p className="text-base text-[#6b7280]">Map unavailable - No API key</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <p className="text-base text-[#6b7280]">
          Error loading map: {loadError.message}
        </p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={API_KEY}
      onError={handleLoadError}
      loadingElement={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-base text-[#6b7280]">Loading map...</p>
        </div>
      }
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        <MarkerF position={center} title={address} />
      </GoogleMap>
    </LoadScript>
  );
}
