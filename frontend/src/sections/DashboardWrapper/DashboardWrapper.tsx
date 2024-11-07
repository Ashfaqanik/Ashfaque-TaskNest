import React from "react";
import styles from "./DashboardWrapper.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

import { useAppSelector } from "../../store/redux";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
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
        } background`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
