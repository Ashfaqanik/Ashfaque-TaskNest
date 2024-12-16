import styles from "./Navbar.module.scss";
import { Link } from "react-router-dom";
import { Search, Settings, Menu, LogOutIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import Toggle from "../../switch/Toggle.jsx";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className={`${styles.navbar} nav text`}>
      {/* Search Bar */}
      <div className={styles.searchBarContainer}>
        {!isSidebarCollapsed ? null : (
          <button
            className={`${styles.menuButton} menu`}
            onClick={toggleSidebar}
          >
            <Menu />
          </button>
        )}
        <div
          className={`${styles.searchContainer} ${
            !isSidebarCollapsed ? styles.expanded : styles.collapsed
          }`}
        >
          <Search className={styles.searchIcon} />
          <input
            className={`${styles.searchInput} searchBox`}
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>
      {/* Icons */}
      <div className={styles.iconContainer}>
        <Toggle toggleMode={toggleTheme} isNightMode={isDarkMode} />

        {/* Profile Image */}
        <Link to="/settings">
          <img src="/p1.jpeg" alt="Profile" className={styles.profileImage} />
        </Link>

        {/* Logout Icon */}
        <button
          onClick={() => {}}
          className={`${styles.logoutButton} logOutColor`}
        >
          <LogOutIcon />
        </button>
      </div>
    </div>
  );
}
