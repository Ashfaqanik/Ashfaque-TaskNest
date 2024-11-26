import styles from "./Navbar.module.scss";
import { Link } from "react-router-dom";
import { Search, Settings, Menu } from "lucide-react";
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
        <Toggle
          toggleMode={toggleTheme}
          isNightMode={isDarkMode}
          //   className={`${styles.toggleButton} ${
          //     isDarkMode ? styles.dark : styles.light
          //   } toggleColor`}
        />
        {/* {isDarkMode ? <Sun /> : <Moon />}
        </Toggle> */}
        <Link to="/settings" className={`${styles.settings} settingsLink`}>
          <Settings />
        </Link>
        <div className={`${styles.divider} dividerColor`} />
      </div>
    </div>
  );
}
