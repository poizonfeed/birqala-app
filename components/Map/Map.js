"use client";

import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getUpvoteColor, getPinSize } from "@/lib/mockData";
import styles from "./Map.module.css";

/**
 * Builds a Leaflet divIcon shaped like a teardrop pin whose colour and size
 * are driven by the post's upvote count.
 */
function createPinIcon(upvotes) {
  const color = getUpvoteColor(upvotes);
  const size = getPinSize(upvotes);

  return L.divIcon({
    className: styles.customPin,
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 200ms ease;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: ${Math.max(10, size * 0.28)}px;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.35);
        ">${upvotes}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

export default function MapView({ posts, onPinClick }) {
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
      {posts.map((post) => (
        <Marker
          key={post.id}
          position={[post.lat, post.lng]}
          icon={createPinIcon(post.upvotes)}
          eventHandlers={{ click: () => onPinClick(post) }}
        />
      ))}
    </MapContainer>
  );
}
