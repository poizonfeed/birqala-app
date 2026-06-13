"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { mockPosts } from "@/lib/mockData";
import FloatingNav from "@/components/FloatingNav/FloatingNav";
import PostCard from "@/components/PostCard/PostCard";
import PostDetail from "@/components/PostDetail/PostDetail";
import Feed from "@/components/Feed/Feed";
import Profile from "@/components/Profile/Profile";
import CreatePost from "@/components/CreatePost/CreatePost";
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
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

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

  const handlePostSubmit = useCallback((newPostData) => {
    const newPost = {
      id: Date.now(),
      username: "Current_User",
      avatar: "CU",
      ...newPostData,
      upvotes: 0,
      lat: 51.1282,
      lng: 71.4306,
      image: null,
      status: null,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setIsCreatingPost(false);
    setActiveTab("feed");
  }, []);

  return (
    <div className={styles.shell}>
      {activeTab === "map" && (
        <MapView
          posts={posts}
          onPinClick={handlePinClick}
          selectedPostId={selectedPost?.id ?? null}
          onMapClick={handleCardClose}
        />
      )}

      {activeTab === "feed" && (
        <Feed 
          posts={posts}
          onPostClick={(post) => {
            setSelectedPost(post);
            setIsDetailOpen(true);
          }} 
        />
      )}

      {activeTab === "profile" && <Profile />}

      {activeTab === "map" && selectedPost && !isDetailOpen && (
        <PostCard
          post={selectedPost}
          onClose={handleCardClose}
          onExpand={handleCardExpand}
        />
      )}

      {isDetailOpen && selectedPost && (
        <PostDetail post={selectedPost} onClose={handleCloseAll} />
      )}

      {isCreatingPost && (
        <CreatePost 
          onClose={() => setIsCreatingPost(false)} 
          onSubmit={handlePostSubmit} 
        />
      )}

      <FloatingNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onCreatePost={() => setIsCreatingPost(true)}
      />
    </div>
  );
}
