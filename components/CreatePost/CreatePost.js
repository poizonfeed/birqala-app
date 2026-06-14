"use client";

import { useState } from "react";
import { X, Camera, MapPin, CheckCircle2 } from "lucide-react";
import styles from "./CreatePost.module.css";

export default function CreatePost({ onClose, onSubmit }) {
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = ["trash", "streetlight", "sidewalk", "pothole", "graffiti", "other"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !selectedTag) return;
    
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      onSubmit({
        text: description,
        tags: [selectedTag],
        severity: "medium", // Default
        image: "/images/test_placeholder.png",
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
          <div className={styles.photoUpload}>
            <div className={styles.uploadedContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/test_placeholder.png" 
                alt="Test upload" 
                className={styles.uploadedImage} 
              />
              <div className={styles.imageOverlay}>
                <Camera size={24} />
                <span>Test Image Uploaded</span>
              </div>
            </div>
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
                <strong>Current Location</strong>
                <span>Astana, Kazakhstan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
