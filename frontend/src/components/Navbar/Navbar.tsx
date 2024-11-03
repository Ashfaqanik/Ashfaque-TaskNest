import styles from "./Navbar.module.scss";
import { Link } from "react-router-dom";
import { Search, Settings, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      {/* Search Bar */}
      <div className={styles.searchBarContainer}>
        {/* {!isSidebarCollapsed ? null : ( */}
        <button
          className={styles.menuButton}
          //onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
        >
          <Menu />
        </button>
        {/* )} */}
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>
      {/* Icons */}
      <div className={styles.iconContainer}>
        <Link to="/settings" className={styles.settingsLink}>
          <Settings className={styles.settings} />
        </Link>
        <div className={styles.divider} />
      </div>
    </div>
  );
}
