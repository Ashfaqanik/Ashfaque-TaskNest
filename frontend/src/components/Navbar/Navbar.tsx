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
import { useGetProfileQuery, useSearchProjectQuery } from "../../state/api.js";
import { useEffect, useState } from "react";
import { useProject } from "../../context/ProjectContext.js";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const { data: user } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { setProjectName, setTeamId } = useProject();
  const [enterPressed, setEnterPressed] = useState(false);

  const onLogoutHandler = () => {
    dispatch(setIsLoggedIn(false));
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    toast.success("You're logged out!", {
      autoClose: 3000,
    });
    navigate("/login");
  };

  const { data: project, isLoading } = useSearchProjectQuery(searchQuery, {
    skip: !searchQuery,
  });

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setSearchQuery(() => {
        setEnterPressed(true);
        return (event.target as HTMLInputElement).value.trim();
      });
    }
  };

  useEffect(() => {
    if (enterPressed) {
      if (searchQuery !== "") {
        if (Array.isArray(project) && project.length > 0) {
          setProjectName(project[0].name);
          setTeamId(project[0].teamId);
          setEnterPressed(false);
          setSearchQuery("");
          navigate(`/projects/${project[0].id}`);
        } else if (!isLoading) {
          toast.error("No Project found!", {
            autoClose: 2000,
          });
          setEnterPressed(false);
        }
      }
    }
  }, [project]);

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
          <input
            className={`${styles.searchInput} searchBox`}
            type="search"
            placeholder="Search Project..."
            onKeyDown={(event) => handleEnterKeyPress(event)}
          />
          <Search className={styles.searchIcon} />
        </div>
      </div>
      {/* Icons */}
      <div className={styles.iconContainer}>
        <Toggle toggleMode={toggleTheme} isNightMode={isDarkMode} />

        {/* Profile Image */}
        <Link to="/settings">
          <img
            src={user && user?.image === "" ? "/default.png" : user?.image}
            alt=""
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
