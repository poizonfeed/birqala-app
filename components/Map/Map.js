"use client";

import { useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getUpvoteColor, getPinSize } from "@/lib/mockData";
import styles from "./Map.module.css";

const ASTANA_CENTER = [51.128, 71.43];
const DEFAULT_ZOOM = 12;

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
        position: relative;
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
        z-index: ${zIndex};
      ">
        <div style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
        ">
          <span style="
            font-size: ${Math.max(12, Math.round(displaySize * 0.35))}px;
            font-weight: 700;
            color: white;
            text-shadow: 0 1px 3px rgba(0,0,0,0.35);
            margin-top: -3px;
            line-height: 1;
          ">${upvotes}</span>
        </div>
      </div>
    `,
    iconSize: [displaySize, displaySize],
    iconAnchor: [displaySize / 2, displaySize],
  });
}

/**
 * Invisible child component — listens for bare map clicks to dismiss PostCard.
 */
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick });
  return null;
}

/**
 * Exposes the map instance to the parent via a ref.
 */
function MapRefBridge({ mapRef }) {
  const map = useMap();
  mapRef.current = map;
  return null;
}

/**
 * Custom map control panel — vertically centered on the right.
 * Buttons: zoom in, zoom out, reset to north (bearing 0), center on Astana.
 */
function MapControls({ mapRef }) {
  const zoomIn = useCallback(() => mapRef.current?.zoomIn(), [mapRef]);
  const zoomOut = useCallback(() => mapRef.current?.zoomOut(), [mapRef]);
  const resetNorth = useCallback(() => {
    // Leaflet core does not support bearing — this just snaps back to default view angle.
    // When a rotation plugin is added later, setBearing(0) goes here.
    mapRef.current?.setView(mapRef.current.getCenter(), mapRef.current.getZoom(), {
      animate: true,
    });
  }, [mapRef]);
  const goToAstana = useCallback(() => {
    mapRef.current?.setView(ASTANA_CENTER, DEFAULT_ZOOM, { animate: true });
  }, [mapRef]);

  return (
    <div className={styles.controls}>
      <button
        className={styles.controlBtn}
        onClick={zoomIn}
        aria-label="Zoom in"
        id="map-zoom-in"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="9" y1="3" x2="9" y2="15" />
          <line x1="3" y1="9" x2="15" y2="9" />
        </svg>
      </button>

      <div className={styles.divider} />

      <button
        className={styles.controlBtn}
        onClick={zoomOut}
        aria-label="Zoom out"
        id="map-zoom-out"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="9" x2="15" y2="9" />
        </svg>
      </button>

      <div className={styles.groupGap} />

      <button
        className={styles.controlBtn}
        onClick={resetNorth}
        aria-label="Orient to north"
        id="map-orient-north"
        title="Align to north"
      >
        {/* Compass needle pointing north */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <polygon points="9,2 11.5,9 9,8 6.5,9" fill="currentColor" />
          <polygon points="9,16 11.5,9 9,10 6.5,9" fill="currentColor" opacity="0.35" />
        </svg>
      </button>

      <div className={styles.divider} />

      <button
        className={styles.controlBtn}
        onClick={goToAstana}
        aria-label="Center on Astana"
        id="map-my-location"
        title="My location (Astana)"
      >
        {/* Location crosshair icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="9" cy="9" r="3" />
          <line x1="9" y1="1" x2="9" y2="5" />
          <line x1="9" y1="13" x2="9" y2="17" />
          <line x1="1" y1="9" x2="5" y2="9" />
          <line x1="13" y1="9" x2="17" y2="9" />
        </svg>
      </button>
    </div>
  );
}

export default function MapView({ posts, onPinClick, selectedPostId, onMapClick }) {
  const mapRef = useRef(null);

  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={ASTANA_CENTER}
        zoom={DEFAULT_ZOOM}
        className={styles.map}
        zoomControl={false}
      >
        <MapRefBridge mapRef={mapRef} />
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

      {/* Custom controls rendered outside Leaflet, absolutely positioned on the right-center */}
      <MapControls mapRef={mapRef} />
    </div>
  );
}
