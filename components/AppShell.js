"use client";

import { useState, useCallback, useEffect } from "react";
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
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (currentUser?.preferences?.useFakeLocation) {
      setCurrentLocation({ 
        lat: currentUser.preferences.fakeLat, 
        lng: currentUser.preferences.fakeLng 
      });
      return;
    }

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [currentUser]);

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
      lat: newPostData.lat || 51.1282,
      lng: newPostData.lng || 71.4306,
      image: newPostData.image || "/images/test_placeholder.png",
      status: null,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);

    // Update currentUser stats: increment postsCreated, add XP, and append history item
    setCurrentUser((prevUser) => {
      const postsCreated = prevUser.stats.postsCreated + 1;
      const xpDelta = 10;
      const newXp = prevUser.xp + xpDelta;
      const level = newXp >= 100 ? "Active Citizen" : "New Citizen";

      const newHistoryItem = {
        id: Date.now(),
        type: "post",
        date: newPost.createdAt,
        title: `Reported ${newPostData.text.slice(0, 30)}...`,
        xpDelta,
      };

      return {
        ...prevUser,
        xp: newXp,
        level,
        stats: {
          ...prevUser.stats,
          postsCreated,
        },
        history: [newHistoryItem, ...prevUser.history],
      };
    });

    setIsCreatingPost(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3200);
  }, [currentUser]);

  const handleCommentSubmit = useCallback((postId, commentText) => {
    const newComment = {
      username: currentUser.username,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setSelectedPost((prevSelected) => {
      if (prevSelected && prevSelected.id === postId) {
        return {
          ...prevSelected,
          comments: [...prevSelected.comments, newComment],
        };
      }
      return prevSelected;
    });
  }, [currentUser]);

  const handleToggleUpvote = useCallback((postId) => {
    const hasUpvoted = currentUser.upvotedPosts?.includes(postId);
    const delta = hasUpvoted ? -1 : 1;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, upvotes: Math.max(0, p.upvotes + delta) };
        }
        return p;
      })
    );

    setSelectedPost((prevSelected) => {
      if (prevSelected && prevSelected.id === postId) {
        return { ...prevSelected, upvotes: Math.max(0, prevSelected.upvotes + delta) };
      }
      return prevSelected;
    });

    setCurrentUser((prevUser) => {
      const newUpvoted = hasUpvoted 
        ? (prevUser.upvotedPosts || []).filter(id => id !== postId)
        : [...(prevUser.upvotedPosts || []), postId];
        
      return { ...prevUser, upvotedPosts: newUpvoted };
    });
  }, [currentUser]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedPost(null);
    setIsDetailOpen(false);
  }, []);

  return (
    <div className={styles.shell}>
      <MapView
        currentUser={currentUser}
        currentLocation={currentLocation}
        posts={posts}
        onPinClick={handlePinClick}
        selectedPostId={selectedPost?.id ?? null}
        onMapClick={handleCardClose}
        visible={activeTab === "map"}
      />

      <Feed 
        posts={posts}
        currentUser={currentUser}
        currentLocation={currentLocation}
        onToggleUpvote={handleToggleUpvote}
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
          currentUser={currentUser}
          currentLocation={currentLocation}
          onToggleUpvote={handleToggleUpvote}
          onClose={handleCardClose}
          onExpand={handleCardExpand}
        />
      )}

      {isDetailOpen && selectedPost && (
        <PostDetail 
          post={selectedPost} 
          currentUser={currentUser}
          currentLocation={currentLocation}
          onToggleUpvote={handleToggleUpvote}
          onClose={handleCloseAll} 
          onAddComment={handleCommentSubmit} 
        />
      )}

      {isCreatingPost && (
        <CreatePost 
          currentUser={currentUser}
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
