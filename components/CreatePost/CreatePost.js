"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, MapPin, CheckCircle2 } from "lucide-react";
import styles from "./CreatePost.module.css";

export default function CreatePost({ currentUser, onClose, onSubmit }) {
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationLoading, setLocationLoading] = useState(true);
  const fileInputRef = useRef(null);

  const tags = ["trash", "streetlight", "sidewalk", "pothole", "graffiti", "other"];

  const [locationError, setLocationError] = useState("");

  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errMsg = "Failed to get location.";
          if (error.code === 1) errMsg = "Location access denied.";
          if (error.code === 2) errMsg = "Position unavailable.";
          if (error.code === 3) errMsg = "Location request timed out.";
          
          setLocationError(errMsg);
          setLocation({ lat: 51.1282, lng: 71.4306 }); // Fallback to Astana
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation not supported.");
      setLocation({ lat: 51.1282, lng: 71.4306 });
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    // Check if user has fake location enabled
    if (currentUser?.preferences?.useFakeLocation) {
      setLocation({ 
        lat: currentUser.preferences.fakeLat, 
        lng: currentUser.preferences.fakeLng 
      });
      setLocationLoading(false);
      return;
    }

    // Otherwise, request real location on mount
    requestLocation();
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !selectedTag || locationLoading) return;
    
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      onSubmit({
        text: description,
        tags: [selectedTag],
        severity: "medium", // Default
        image: imagePreview || "/images/test_placeholder.png",
        lat: location.lat,
        lng: location.lng,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
          <h2>Report Issue</h2>
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={!description || !selectedTag || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.photoUpload} onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className={styles.uploadedContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Captured" 
                  className={styles.uploadedImage} 
                />
                <div className={styles.imageOverlay}>
                  <Camera size={24} />
                  <span>Tap to Retake</span>
                </div>
              </div>
            ) : (
              <div className={styles.photoPlaceholder}>
                <Camera size={32} />
                <span>Take Photo</span>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h3>What is the problem?</h3>
            <div className={styles.tags}>
              {tags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagBtn} ${selectedTag === tag ? styles.activeTag : ""}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {selectedTag === tag && <CheckCircle2 size={14} className={styles.checkIcon} />}
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Description</h3>
            <textarea
              className={styles.textarea}
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              rows={4}
            />
          </div>

          <div className={styles.section}>
            <h3>Location</h3>
            <div className={styles.locationBox}>
              <div className={styles.mapSim}>
                <MapPin size={24} className={styles.pinIcon} />
              </div>
              <div className={styles.locationText}>
                <strong>{locationError ? "Location Error" : "Current Location"}</strong>
                <span style={{ color: locationError ? "var(--error, #d32f2f)" : "var(--text-secondary)" }}>
                  {locationLoading 
                    ? "Locating..." 
                    : locationError 
                      ? <>{locationError} <br/><span style={{fontSize: '0.75rem', opacity: 0.8}}>Fallback: Astana (You can use fake geolocation in settings)</span></>
                      : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                </span>
              </div>
              {(!currentUser?.preferences?.useFakeLocation) && (
                <button 
                  className={styles.retryLocationBtn} 
                  onClick={requestLocation}
                  disabled={locationLoading}
                  aria-label="Retry Location"
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  {locationLoading ? "..." : "Retry"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
