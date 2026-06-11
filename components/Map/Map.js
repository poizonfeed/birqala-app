"use client";

import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getUpvoteColor, getPinSize } from "@/lib/mockData";
import styles from "./Map.module.css";

/**
 * Builds a Leaflet divIcon shaped like a teardrop pin.
 * When selected the pin gets a bright white ring and a larger shadow.
 */
function createPinIcon(upvotes, isSelected) {
  const color = getUpvoteColor(upvotes);
  const size = getPinSize(upvotes);
  const displaySize = isSelected ? size * 1.22 : size;
  const border = isSelected ? "3px solid white" : "3px solid white";
  const boxShadow = isSelected
    ? `0 0 0 3px ${color}, 0 6px 20px rgba(0,0,0,0.4)`
    : "0 3px 12px rgba(0,0,0,0.25)";
  const zIndex = isSelected ? 1000 : "auto";

  return L.divIcon({
    className: styles.customPin,
    html: `
      <div style="
        width: ${displaySize}px;
        height: ${displaySize}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: ${border};
        box-shadow: ${boxShadow};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        z-index: ${zIndex};
      ">
        <span style="
          transform: rotate(45deg);
          font-size: ${Math.max(10, displaySize * 0.28)}px;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.35);
        ">${upvotes}</span>
      </div>
    `,
    iconSize: [displaySize, displaySize],
    iconAnchor: [displaySize / 2, displaySize],
  });
}

/**
 * Invisible child component that listens for bare map clicks
 * (not on a marker) and fires onMapClick to dismiss the PostCard.
 */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

export default function MapView({ posts, onPinClick, selectedPostId, onMapClick }) {
  const astanaCenter = [51.128, 71.43];

  return (
    <MapContainer
      center={astanaCenter}
      zoom={12}
      className={styles.map}
      zoomControl={false}
    >
      <ZoomControl position="topright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />
      <MapClickHandler onMapClick={onMapClick} />
      {posts.map((post) => (
        <Marker
          key={post.id}
          position={[post.lat, post.lng]}
          icon={createPinIcon(post.upvotes, post.id === selectedPostId)}
          eventHandlers={{ click: () => onPinClick(post) }}
        />
      ))}
    </MapContainer>
  );
}
