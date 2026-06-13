import styles from "./Profile.module.css";
import { UserCircle } from "lucide-react";

export default function Profile() {
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <UserCircle size={80} className={styles.icon} />
        <h2>Profile Coming Soon</h2>
        <p>This section will be built in Stage 3.</p>
      </div>
    </div>
  );
}
