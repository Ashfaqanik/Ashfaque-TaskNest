import React from "react";
import styles from "./DashboardWrapper.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className="main">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
