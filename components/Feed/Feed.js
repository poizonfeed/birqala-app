"use client";

import { useState, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, MapPin, ArrowUp } from "lucide-react";
import styles from "./Feed.module.css";
import { formatTimeAgo, getUpvoteColor } from "@/lib/mockData";

export default function Feed({ posts, onPostClick, visible }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("top"); // 'top', 'recent', 'relevance'
  const listRef = useRef(null);

  const handleSortClick = (mode) => {
    setSortBy(mode);
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.text.toLowerCase().includes(lowerQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "top") {
        return b.upvotes - a.upvotes;
      } else if (sortBy === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "relevance") {
        // Mock relevance: combination of recency and upvotes
        const timeScoreA = new Date(a.createdAt).getTime();
        const timeScoreB = new Date(b.createdAt).getTime();
        const scoreA = a.upvotes * 1000000 + timeScoreA;
        const scoreB = b.upvotes * 1000000 + timeScoreB;
        return scoreB - scoreA;
      }
      return 0;
    });

    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className={styles.container} style={{ display: visible ? "flex" : "none" }}>
      <header className={styles.header}>
        <h1 className={styles.title}>City Feed</h1>
        
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search problems, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.sortContainer}>
          <SlidersHorizontal size={18} className={styles.sortIcon} />
          <div className={styles.sortTabs}>
             {["top", "recent", "relevance"].map((mode) => (
              <button
                key={mode}
                className={`${styles.sortTab} ${sortBy === mode ? styles.activeSort : ""}`}
                onClick={() => handleSortClick(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.list} ref={listRef}>
        {filteredAndSortedPosts.length > 0 ? (
          filteredAndSortedPosts.map((post) => (
            <div key={post.id} className={styles.postCard} onClick={() => onPostClick(post)}>
              <div className={styles.postHeader}>
                <div className={styles.avatar}>{post.avatar}</div>
                <div className={styles.meta}>
                  <span className={styles.username}>@{post.username}</span>
                  <span className={styles.time}>{formatTimeAgo(post.createdAt)}</span>
                </div>
                <div 
                  className={styles.upvotes}
                  style={{ color: getUpvoteColor(post.upvotes) }}
                >
                  <ArrowUp size={18} strokeWidth={2.5} className={styles.upvoteIcon} />
                  <span>{post.upvotes}</span>
                </div>
              </div>
              <p className={styles.text}>{post.text}</p>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
              {post.image && (
                <div className={styles.imageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt="Problem" className={styles.image} />
                </div>
              )}
              <div className={styles.location}>
                <MapPin size={14} />
                <span>Tap to view on map</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
