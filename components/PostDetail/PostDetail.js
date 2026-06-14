"use client";

import { useRef, useState } from "react";
import { getUpvoteColor, formatTimeAgo } from "@/lib/mockData";
import { ArrowUp, Clock, X, MessageCircle, Send } from "lucide-react";
import { calculateDistanceInMeters } from "@/lib/utils";
import styles from "./PostDetail.module.css";

export default function PostDetail({ post, currentUser, currentLocation, onToggleUpvote, onClose, onAddComment }) {
  if (!post) return null;

  const [commentText, setCommentText] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const commentsRef = useRef(null);

  const distance = currentLocation ? calculateDistanceInMeters(currentLocation.lat, currentLocation.lng, post.lat, post.lng) : Infinity;
  const isTooFar = distance > 100;
  const hasUpvoted = currentUser?.upvotedPosts?.includes(post.id);
  const baseUpvoteColor = getUpvoteColor(post.upvotes);
  
  const displayBg = hasUpvoted ? "var(--primary)" : "transparent";
  const displayColor = errorMessage ? "#9e9e9e" : (hasUpvoted ? "#fff" : baseUpvoteColor);
  const borderColor = errorMessage ? "#9e9e9e" : (hasUpvoted ? "var(--primary)" : baseUpvoteColor);

  const handleUpvoteClick = () => {
    if (post.username === currentUser?.username) {
      setErrorMessage("You cannot verify your own issue.");
    } else if (isTooFar) {
      setErrorMessage("Must be within 100m to verify.");
    } else {
      setErrorMessage("");
      onToggleUpvote(post.id);
    }
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* modalWrapper lets the outer X button position relative to the modal */}
      <div className={styles.modalWrapper}>

        {/* Close button — floats above the top-right corner of the modal */}
        <button
          className={styles.closeBtnOuter}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Drag handle */}
          <div className={styles.handle} />

          {/* Scrollable content */}
          <div className={styles.scrollArea}>

            {/* Sticky header — username + avatar */}
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

            {/* Upvote bar + tags */}
            <div className={styles.upvoteBar}>
              <div className={styles.statsContainer}>
                <div className={styles.upvoteWrapper}>
                  <button
                    className={`${styles.upvotes} ${errorMessage ? styles.hasError : ""}`}
                    style={{ backgroundColor: displayBg, color: displayColor, borderColor: borderColor }}
                    onClick={handleUpvoteClick}
                    title="Verify this issue"
                  >
                    <ArrowUp size={20} strokeWidth={2.5} />
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
                <button
                  className={`${styles.commentsBtn} ${
                    post.comments.length === 0 ? styles.dimmed : ""
                  }`}
                  onClick={scrollToComments}
                  aria-label="Scroll to comments"
                >
                  <MessageCircle size={20} />
                  <span>{post.comments.length} comments</span>
                </button>
              </div>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Full text */}
            <p className={styles.text}>{post.text}</p>

            {/* Comments section */}
            <div ref={commentsRef} className={styles.commentsSection}>
              <h3 className={styles.commentsTitle}>
                <MessageCircle size={18} />
                Comments ({post.comments.length})
              </h3>

              {post.comments.length === 0 ? (
                <p className={styles.noComments}>
                  No comments yet. Be the first to share your thoughts.
                </p>
              ) : (
                <div className={styles.commentsList}>
                  {post.comments.map((comment, i) => (
                    <div key={i} className={styles.comment}>
                      <div className={styles.commentAvatar}>
                        {comment.username.charAt(0)}
                      </div>
                      <div className={styles.commentBody}>
                        <span className={styles.commentUsername}>
                          {comment.username}
                        </span>
                        <p className={styles.commentText}>{comment.text}</p>
                        <span className={styles.commentTime}>
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comment input bar */}
          <form 
            className={styles.commentInput} 
            onSubmit={(e) => {
              e.preventDefault();
              if (!commentText.trim()) return;
              onAddComment(post.id, commentText.trim());
              setCommentText("");
            }}
          >
            <input
              type="text"
              placeholder="Add a comment…"
              className={styles.input}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <button 
              type="submit" 
              className={styles.sendBtn} 
              aria-label="Send comment"
              disabled={!commentText.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
