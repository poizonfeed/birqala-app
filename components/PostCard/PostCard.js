"use client";

import { useState } from "react";
import { getUpvoteColor, formatTimeAgo } from "@/lib/mockData";
import { ArrowUp, Clock, MessageCircle, X } from "lucide-react";
import { calculateDistanceInMeters } from "@/lib/utils";
import styles from "./PostCard.module.css";

export default function PostCard({ post, currentUser, currentLocation, onToggleUpvote, onClose, onExpand }) {
  if (!post) return null;

  const [errorMessage, setErrorMessage] = useState("");

  const truncated =
    post.text.length > 120 ? post.text.slice(0, 120) + "…" : post.text;

  const distance = currentLocation ? calculateDistanceInMeters(currentLocation.lat, currentLocation.lng, post.lat, post.lng) : Infinity;
  const isTooFar = distance > 100;
  const hasUpvoted = currentUser?.upvotedPosts?.includes(post.id);
  const baseUpvoteColor = getUpvoteColor(post.upvotes);
  
  const displayBg = hasUpvoted ? "var(--primary)" : "transparent";
  const displayColor = errorMessage ? "#9e9e9e" : (hasUpvoted ? "#fff" : baseUpvoteColor);
  const borderColor = errorMessage ? "#9e9e9e" : (hasUpvoted ? "var(--primary)" : baseUpvoteColor);

  const handleUpvoteClick = (e) => {
    e.stopPropagation();
    if (post.username === currentUser?.username) {
      setErrorMessage("You cannot verify your own issue.");
    } else if (isTooFar) {
      setErrorMessage("Must be within 100m to verify.");
    } else {
      setErrorMessage("");
      onToggleUpvote(post.id);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        id="map-post-card"
        className={styles.card}
        onClick={(e) => {
          e.stopPropagation();
          onExpand();
        }}
      >
        {/* Drag handle */}
        <div className={styles.handle} />

        {/* Header — username above the photo */}
        <div className={styles.header}>
          <div className={styles.avatar}>{post.avatar}</div>
          <div className={styles.userInfo}>
            <span className={styles.username}>{post.username}</span>
            <span className={styles.time}>
              <Clock size={12} />
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
          {post.status && (
            <span className={styles.status}>{post.status}</span>
          )}
        </div>

        {/* Photo */}
        <div className={styles.imageWrapper}>
          <img
            src={post.image}
            alt={post.tags[0]}
            className={styles.image}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Truncated text */}
        <p className={styles.text}>{truncated}</p>

        {/* Tags + upvotes */}
        <div className={styles.footer}>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
          <div className={styles.stats}>
            <div
              className={`${styles.comments} ${
                post.comments.length === 0 ? styles.dimmed : ""
              }`}
            >
              <MessageCircle size={18} />
              <span>{post.comments.length}</span>
            </div>
            <div className={styles.upvoteWrapper}>
              <button
                className={`${styles.upvotes} ${errorMessage ? styles.hasError : ""}`}
                style={{ backgroundColor: displayBg, color: displayColor, borderColor: borderColor }}
                onClick={handleUpvoteClick}
                title="Verify this issue"
              >
                <ArrowUp size={18} strokeWidth={2.5} />
                <span>{post.upvotes}</span>
              </button>
              {errorMessage && (
                <div className={styles.errorPopup}>
                  <span>{errorMessage}</span>
                  <button className={styles.closeError} onClick={(e) => { e.stopPropagation(); setErrorMessage(""); }}>
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
