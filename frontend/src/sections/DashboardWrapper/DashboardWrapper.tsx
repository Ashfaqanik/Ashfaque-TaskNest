import styles from "./DashboardWrapper.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import { useAppSelector } from "../../store/redux";
import Project from "../projectSections/Project";
import Home from "../Home/Home";
import Timeline from "../Timeline/Timeline";
import SearchPage from "../Search/SearchPage";
import Settings from "../Settings/Settings";
import Users from "../Users/Users";
import Teams from "../Teams/Teams";
import Urgent from "../Priority/Urgent";
import High from "../Priority/High";
import Medium from "../Priority/Medium";
import Low from "../Priority/Low";
import Backlog from "../Priority/Backlog";

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
          <Route path="/teams" element={<Teams />} />
          <Route path="/priority/urgent" element={<Urgent />} />
          <Route path="/priority/high" element={<High />} />
          <Route path="/priority/medium" element={<Medium />} />
          <Route path="/priority/low" element={<Low />} />
          <Route path="/priority/backlog" element={<Backlog />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardWrapper;
