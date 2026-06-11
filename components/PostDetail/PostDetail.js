"use client";

import { getUpvoteColor, formatTimeAgo } from "@/lib/mockData";
import { ArrowUp, Clock, X, MessageCircle, Send } from "lucide-react";
import styles from "./PostDetail.module.css";

export default function PostDetail({ post, onClose }) {
  if (!post) return null;

  const upvoteColor = getUpvoteColor(post.upvotes);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div className={styles.handle} />

        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>

        {/* Scrollable content */}
        <div className={styles.scrollArea}>
          {/* Header */}
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
            <div
              className={styles.upvotes}
              style={{ color: upvoteColor, borderColor: upvoteColor }}
            >
              <ArrowUp size={20} strokeWidth={2.5} />
              <span>{post.upvotes} confirmations</span>
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

          {/* Comments */}
          <div className={styles.commentsSection}>
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
        <div className={styles.commentInput}>
          <input
            type="text"
            placeholder="Add a comment…"
            className={styles.input}
          />
          <button className={styles.sendBtn} aria-label="Send comment">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
