"use client";

import { useState } from "react";
import styles from "./Profile.module.css";
import { formatTimeAgo } from "@/lib/mockData";
import { Medal, Target, Zap, Settings, CheckCircle2, CheckSquare, ImagePlus, Bell, X } from "lucide-react";

// Helper function to dynamically generate initials for the avatar
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Profile({ visible, currentUser, onUpdateUser }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(currentUser.fullName);
  const [editUsername, setEditUsername] = useState(currentUser.username);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!editFullName.trim() || !editUsername.trim()) return;

    onUpdateUser({
      ...currentUser,
      fullName: editFullName.trim(),
      username: editUsername.trim(),
      avatar: getInitials(editFullName.trim()),
    });
    setIsSettingsOpen(false);
  };

  const handleOpenSettings = () => {
    setEditFullName(currentUser.fullName);
    setEditUsername(currentUser.username);
    setIsSettingsOpen(true);
  };

  return (
    <div className={styles.container} style={{ display: visible ? "flex" : "none" }}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h2>Profile</h2>
          <div className={styles.headerActions}>
            <div className={styles.notificationBtn} title="Notifications">
              <Bell size={22} />
            </div>
            <button 
              className={styles.settingsBtn}
              onClick={handleOpenSettings}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={22} />
            </button>
          </div>
        </div>
        
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{currentUser.avatar}</div>
            <div className={styles.userInfo}>
              <h1 className={styles.fullName}>{currentUser.fullName}</h1>
              <p className={styles.username}>@{currentUser.username}</p>
            </div>
          </div>
          
          <div className={styles.badges}>
            <div className={styles.badge}>
              <Medal size={16} className={styles.badgeIcon} />
              <span>{currentUser.level}</span>
            </div>
            <div className={styles.badgeHighlight}>
              <Target size={16} className={styles.badgeIconHighlight} />
              <span>{currentUser.rank && currentUser.rank !== "-" ? `Top ${currentUser.rank} this week` : "Unranked this week"}</span>
            </div>
          </div>
          
          <div className={styles.xpSection}>
            <div className={styles.xpHeader}>
              <div className={styles.xpTotal}>
                <Zap size={24} className={styles.xpIcon} />
                <span>{currentUser.xp} XP</span>
              </div>
              <span className={styles.xpNext}>Next: 500 XP</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${(currentUser.xp / 500) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{currentUser.stats.postsCreated}</span>
          <span className={styles.statLabel}>Posts</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{currentUser.stats.verifications}</span>
          <span className={styles.statLabel}>Verified</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{currentUser.stats.resolvedIssues}</span>
          <span className={styles.statLabel}>Resolved</span>
        </div>
      </div>

      <div className={styles.historySection}>
        <h3 className={styles.sectionTitle}>Recent Activity</h3>
        <div className={styles.historyList}>
          {currentUser.history.map((item) => (
            <div key={item.id} className={styles.historyItem}>
              <div className={styles.historyIconWrapper} data-type={item.type}>
                {item.type === 'resolved' && <CheckCircle2 size={20} />}
                {item.type === 'verification' && <CheckSquare size={20} />}
                {item.type === 'post' && <ImagePlus size={20} />}
              </div>
              <div className={styles.historyContent}>
                <p className={styles.historyTitle}>{item.title}</p>
                <span className={styles.historyTime}>{formatTimeAgo(item.date)}</span>
              </div>
              <div className={styles.historyXp}>
                +{item.xpDelta} XP
              </div>
            </div>
          ))}
        </div>
      </div>

      {isSettingsOpen && (
        <div className={styles.settingsOverlay} onClick={() => setIsSettingsOpen(false)}>
          <div className={styles.settingsContainer} onClick={(e) => e.stopPropagation()}>
            <header className={styles.settingsHeader}>
              <h2>Settings</h2>
              <button className={styles.settingsCloseBtn} onClick={() => setIsSettingsOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </header>
            
            <div className={styles.settingsContent}>
              <div className={styles.settingsField}>
                <label htmlFor="settings-fullname">Full Name</label>
                <input 
                  id="settings-fullname"
                  type="text" 
                  value={editFullName} 
                  onChange={(e) => setEditFullName(e.target.value)} 
                  placeholder="Enter full name"
                  maxLength={30}
                />
              </div>
              
              <div className={styles.settingsField}>
                <label htmlFor="settings-username">Username</label>
                <div className={styles.usernameInputWrapper}>
                  <span>@</span>
                  <input 
                    id="settings-username"
                    type="text" 
                    value={editUsername} 
                    onChange={(e) => setEditUsername(e.target.value)} 
                    placeholder="username"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            <footer className={styles.settingsFooter}>
              <button className={styles.settingsCancelBtn} onClick={() => setIsSettingsOpen(false)}>
                Cancel
              </button>
              <button 
                className={styles.settingsSaveBtn} 
                onClick={handleSaveSettings}
                disabled={!editFullName.trim() || !editUsername.trim()}
              >
                Save Changes
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
