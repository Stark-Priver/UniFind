"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const mapContainerStyle = {
  width: "100%",
  height: "100%"
};

export default function Map() {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading map...</div>;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentPosition}
        zoom={13}
        onClick={(e) => {
          if (e.latLng) {
            setCurrentPosition({
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            });
          }
        }}
      >
        <Marker position={currentPosition} />
      </GoogleMap>
    </LoadScript>
  );
}