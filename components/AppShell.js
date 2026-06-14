"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { mockPosts, mockUser } from "@/lib/mockData";
import FloatingNav from "@/components/FloatingNav/FloatingNav";
import PostCard from "@/components/PostCard/PostCard";
import PostDetail from "@/components/PostDetail/PostDetail";
import Feed from "@/components/Feed/Feed";
import Profile from "@/components/Profile/Profile";
import CreatePost from "@/components/CreatePost/CreatePost";
import PostSuccess from "@/components/CreatePost/PostSuccess";
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [currentUser, setCurrentUser] = useState(mockUser);

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
      username: currentUser.username,
      avatar: currentUser.avatar,
      ...newPostData,
      upvotes: 0,
      lat: 51.1282,
      lng: 71.4306,
      image: newPostData.image || "/images/test_placeholder.png",
      status: null,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setIsCreatingPost(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3200);
  }, [currentUser]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedPost(null);
    setIsDetailOpen(false);
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

      <Feed 
        posts={posts}
        onPostClick={(post) => {
          setSelectedPost(post);
          setIsDetailOpen(false);
          setActiveTab("map");
        }} 
        visible={activeTab === "feed"}
      />

      <Profile 
        visible={activeTab === "profile"} 
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
      />

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

      {showSuccess && <PostSuccess />}

      {activeTab !== "map" && <div className={styles.bottomBarBlur} />}

      <FloatingNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onCreatePost={() => setIsCreatingPost(true)}
      />
    </div>
  );
}
