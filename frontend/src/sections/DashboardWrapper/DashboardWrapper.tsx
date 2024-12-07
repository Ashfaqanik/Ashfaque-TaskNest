import styles from "./DashboardWrapper.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import { useAppSelector } from "../../store/redux";
import Project from "../ProjectSections/Project";
import Home from "../Home/Home";
import Timeline from "../Timeline/Timeline";
import SearchPage from "../Search/SearchPage";
import Settings from "../Settings/Settings";
import Users from "../Users/Users";

const DashboardWrapper = () => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? "dark" : "light"}`}>
      <div className="sidebarColor">
        <Sidebar />
      </div>
      <main
        className={`${styles.main} ${
          isSidebarCollapsed
            ? styles["sidebar-collapsed"]
            : styles["sidebar-expanded"]
        }`}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardWrapper;
