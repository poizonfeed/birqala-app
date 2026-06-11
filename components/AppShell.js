"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { mockPosts } from "@/lib/mockData";
import FloatingNav from "@/components/FloatingNav/FloatingNav";
import PostCard from "@/components/PostCard/PostCard";
import PostDetail from "@/components/PostDetail/PostDetail";
import styles from "./AppShell.module.css";

const MapView = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapLoading}>
      <div className={styles.loadingSpinner} />
      <span>Loading map…</span>
    </div>
  ),
});

export default function AppShell() {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handlePinClick = useCallback((post) => {
    setSelectedPost(post);
    setIsDetailOpen(false);
  }, []);

  const handleCardExpand = useCallback(() => {
    setIsDetailOpen(true);
  }, []);

  const handleCloseAll = useCallback(() => {
    setSelectedPost(null);
    setIsDetailOpen(false);
  }, []);

  const handleCardClose = useCallback(() => {
    setSelectedPost(null);
  }, []);

  return (
    <div className={styles.shell}>
      <MapView
        posts={mockPosts}
        onPinClick={handlePinClick}
        selectedPostId={selectedPost?.id ?? null}
        onMapClick={handleCardClose}
      />

      {selectedPost && !isDetailOpen && (
        <PostCard
          post={selectedPost}
          onClose={handleCardClose}
          onExpand={handleCardExpand}
        />
      )}

      {isDetailOpen && selectedPost && (
        <PostDetail post={selectedPost} onClose={handleCloseAll} />
      )}

      <FloatingNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
