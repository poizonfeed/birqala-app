"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Map, Newspaper, User, Plus, Check } from "lucide-react";
import styles from "./FloatingNav.module.css";

export default function FloatingNav({ activeTab, onTabChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const islandRef = useRef(null);
  const draggingRef = useRef(false);

  /* keep a ref in sync so the move/end handlers never read stale state */
  useEffect(() => {
    draggingRef.current = isDragging;
  }, [isDragging]);

  /* ── Touch / mouse handling ─────────────────────────────── */

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragProgress(0);
    setIsComplete(false);
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!draggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const island = islandRef.current;
      if (!island) return;

      const rect = island.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      setDragProgress(progress);

      if (progress >= 0.92) {
        draggingRef.current = false;
        setIsDragging(false);
        setIsComplete(true);
        setTimeout(() => {
          setIsComplete(false);
          setDragProgress(0);
        }, 1800);
      }
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    if (draggingRef.current) {
      setIsDragging(false);
      setDragProgress(0);
    }
  }, []);

  /* Attach document-level listeners while dragging so the gesture
     still works if the pointer leaves the nav area. */
  useEffect(() => {
    if (!isDragging) return;
    const move = (e) => handleDragMove(e);
    const end = () => handleDragEnd();
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const navItems = [
    { key: "map", icon: Map, label: "Map" },
    { key: "feed", icon: Newspaper, label: "Feed" },
    { key: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className={styles.container}>
      {/* ── Create-post handle ──────────────────────────────── */}
      <button
        className={`${styles.createBtn} ${isDragging ? styles.createBtnActive : ""} ${isComplete ? styles.createBtnComplete : ""}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        aria-label="Slide to create a post"
      >
        {isComplete ? <Check size={24} /> : <Plus size={24} />}
      </button>

      {/* ── Navigation island ───────────────────────────────── */}
      <div className={styles.island} ref={islandRef}>
        {/* Swipe overlay that grows from left to right */}
        <div
          className={`${styles.swipeOverlay} ${isComplete ? styles.swipeOverlayComplete : ""}`}
          style={{
            transform: `scaleX(${isComplete ? 1 : dragProgress})`,
            opacity: isDragging || isComplete ? 1 : 0,
          }}
        />

        {/* Hint text visible during drag */}
        {(isDragging || isComplete) && (
          <div className={`${styles.swipeHint} ${isComplete ? styles.swipeHintComplete : ""}`}>
            <span className={styles.swipeHintInner}>
              {isComplete ? "Post Created!" : "Slide to create"}
            </span>
          </div>
        )}

        {navItems.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`${styles.navBtn} ${activeTab === key ? styles.navBtnActive : ""}`}
            onClick={() => onTabChange(key)}
            style={{ opacity: isDragging ? 0.15 : isComplete ? 0 : 1, transition: "opacity 250ms ease" }}
          >
            <Icon size={21} strokeWidth={activeTab === key ? 2.4 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
