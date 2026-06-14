"use client";

import styles from "./Profile.module.css";
import { mockUser, formatTimeAgo } from "@/lib/mockData";
import { Medal, Target, Zap, Settings, CheckCircle2, CheckSquare, ImagePlus, Bell } from "lucide-react";

export default function Profile({ visible }) {
  return (
    <div className={styles.container} style={{ display: visible ? "flex" : "none" }}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h2>Profile</h2>
          <div className={styles.headerActions}>
            <div className={styles.notificationBtn} title="Notifications">
              <Bell size={22} />
            </div>
            <button className={styles.settingsBtn}>
              <Settings size={22} />
            </button>
          </div>
        </div>
        
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{mockUser.avatar}</div>
            <div className={styles.userInfo}>
              <h1 className={styles.fullName}>{mockUser.fullName}</h1>
              <p className={styles.username}>@{mockUser.username}</p>
            </div>
          </div>
          
          <div className={styles.badges}>
            <div className={styles.badge}>
              <Medal size={16} className={styles.badgeIcon} />
              <span>{mockUser.level}</span>
            </div>
            <div className={styles.badgeHighlight}>
              <Target size={16} className={styles.badgeIconHighlight} />
              <span>Top {mockUser.rank} this week</span>
            </div>
          </div>
          
          <div className={styles.xpSection}>
            <div className={styles.xpHeader}>
              <div className={styles.xpTotal}>
                <Zap size={24} className={styles.xpIcon} />
                <span>{mockUser.xp} XP</span>
              </div>
              <span className={styles.xpNext}>Next: 500 XP</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${(mockUser.xp / 500) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{mockUser.stats.postsCreated}</span>
          <span className={styles.statLabel}>Posts</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{mockUser.stats.verifications}</span>
          <span className={styles.statLabel}>Verified</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{mockUser.stats.resolvedIssues}</span>
          <span className={styles.statLabel}>Resolved</span>
        </div>
      </div>

      <div className={styles.historySection}>
        <h3 className={styles.sectionTitle}>Recent Activity</h3>
        <div className={styles.historyList}>
          {mockUser.history.map((item) => (
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
    </div>
  );
}
