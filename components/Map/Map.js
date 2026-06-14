"use client";

import { useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
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
 * Custom cluster icon for grouped markers
 */
function createClusterCustomIcon(cluster) {
  const count = cluster.getChildCount();
  const size = Math.min(60, 36 + (count * 1.5)); // Dynamic size based on count, max 60px
  
  return L.divIcon({
    html: `
      <div style="
        background-color: var(--primary);
        color: var(--on-primary);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: ${Math.max(14, size * 0.35)}px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 3px solid white;
        transition: transform 0.2s;
      ">
        ${count}
      </div>
    `,
    className: "custom-marker-cluster",
    iconSize: L.point(size, size, true),
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
 * Automatically pans the map to center on the selected post.
 */
function FocusSelectedPin({ selectedPost }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedPost) {
      const zoom = map.getZoom();
      const targetZoom = Math.max(18, zoom);
      
      const centerMap = () => {
        const cardElement = document.getElementById("map-post-card");
        const cardHeight = cardElement ? cardElement.offsetHeight : (selectedPost.image ? 330 : 150);
        
        // Calculate dynamic vertical offset based on map viewport and card height.
        // The card floats 104px (bottom-padding of overlay container) above the bottom.
        const viewportHeight = map.getSize().y || window.innerHeight || 600;
        
        // Position the pin tip just above the card (with a 55px gap) instead of centering it in the remaining space.
        // Formula: offset = (card bottom offset + cardHeight + gap) - viewportHeight / 2
        const gap = 55;
        let offset = 104 + cardHeight + gap - viewportHeight / 2;
        
        // Clamp the offset to ensure the pin stays at least 40px below the top edge of the screen
        const maxOffset = Math.max(0, viewportHeight / 2 - 40);
        offset = Math.min(offset, maxOffset);
        
        // Project lat/lng to pixel coords at target zoom
        const targetPoint = map.project([selectedPost.lat, selectedPost.lng], targetZoom);
        // Add y-offset (in pixels) to pan map down, pushing the pin upwards on the screen
        const offsetPoint = targetPoint.add([0, offset]);
        // Unproject back to lat/lng
        const targetLatLng = map.unproject(offsetPoint, targetZoom);

        map.setView(targetLatLng, targetZoom, {
          animate: true,
          duration: 0.8,
        });
      };

      // Wait 50ms for React render and CSS transitions to mount the element in DOM
      const timer = setTimeout(centerMap, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedPost, map]);

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
      <div className={styles.watermark}>BirQala</div>
      <MapContainer
        center={ASTANA_CENTER}
        zoom={DEFAULT_ZOOM}
        className={styles.map}
        zoomControl={false}
      >
        <MapRefBridge mapRef={mapRef} />
        <FocusSelectedPin selectedPost={posts.find((p) => p.id === selectedPostId)} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapClickHandler onMapClick={onMapClick} />
        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={45}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {posts.map((post) => (
            <Marker
              key={post.id}
              position={[post.lat, post.lng]}
              icon={createPinIcon(post.upvotes, post.id === selectedPostId)}
              eventHandlers={{ click: () => onPinClick(post) }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Custom controls rendered outside Leaflet, absolutely positioned on the right-center */}
      <MapControls mapRef={mapRef} />
    </div>
  );
}
