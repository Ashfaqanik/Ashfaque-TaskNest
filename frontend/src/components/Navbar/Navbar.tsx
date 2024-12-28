import styles from "./Navbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, LogOutIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import Toggle from "../../switch/Toggle.jsx";
import { useAppDispatch } from "../../store/redux.js";
import { setIsLoggedIn } from "../../state/globalReducer.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetProfileQuery } from "../../state/api.js";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogoutHandler = () => {
    dispatch(setIsLoggedIn(false));
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    toast.success("You're logged out!", {
      autoClose: 3000,
    });
    navigate("/login");
  };

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
          <img
            src={
              user && user?.image === ""
                ? "https://res.cloudinary.com/dpabqdea9/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1734750736/avatar_z6gypr.webp"
                : user?.image
            }
            alt="Profile"
            className={styles.profileImage}
          />
        </Link>

        {/* Logout Icon */}
        <button
          onClick={onLogoutHandler}
          className={`${styles.logoutButton} logOutColor`}
        >
          <div className={styles.iconCircle}>
            <LogOutIcon />
            {/* <span className={styles.logoutText}>Log Out</span> */}
          </div>
        </button>
      </div>
    </div>
  );
}
