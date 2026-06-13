"use client";

import { getUpvoteColor, formatTimeAgo } from "@/lib/mockData";
import { ArrowUp, Clock, MessageCircle } from "lucide-react";
import styles from "./PostCard.module.css";

export default function PostCard({ post, onClose, onExpand }) {
  if (!post) return null;

  const truncated =
    post.text.length > 120 ? post.text.slice(0, 120) + "…" : post.text;
  const upvoteColor = getUpvoteColor(post.upvotes);

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
            <div className={styles.upvotes} style={{ color: upvoteColor }}>
              <ArrowUp size={18} strokeWidth={2.5} />
              <span>{post.upvotes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
