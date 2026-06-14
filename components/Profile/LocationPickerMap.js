"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// A simple green dot icon for the selected location
const pickerIcon = L.divIcon({
  html: `
    <div style="
      width: 16px;
      height: 16px;
      background: var(--primary, #2E7D32);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({ lat, lng, onLocationSelect }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Invalidate size to ensure it renders correctly if it's placed inside a modal/transition
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom(), { animate: true });
    }
  }, [lat, lng]);

  return (
    <div style={{ height: "180px", width: "100%", borderRadius: "12px", overflow: "hidden", marginTop: "8px", border: "1px solid var(--outline-variant)", position: "relative", zIndex: 1 }}>
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <Marker position={[lat, lng]} icon={pickerIcon} />
        <MapEvents onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
