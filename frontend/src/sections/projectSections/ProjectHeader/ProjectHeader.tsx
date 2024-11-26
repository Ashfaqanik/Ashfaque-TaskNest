import React, { useState } from "react";
import Header from "../../../components/Header/Header";
import { useAppSelector } from "../../../store/redux";

import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
} from "lucide-react";
import ModalNewProject from "../../../components/ModalNewTask/ModalNewTask";
import styles from "./ProjectHeader.module.scss";

// Defined types for Props
type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader: React.FC<Props> = ({ activeTab, setActiveTab }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] =
    useState<boolean>(false);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  console.log(`projectHeader${isSidebarCollapsed}`);
  return (
    <div
      className={`${styles.projectHeader} ${
        !isSidebarCollapsed ? styles.expanded : styles.collapsed
      } projectHeader`}
    >
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className={styles.headerContainer}>
        <Header
          name="Project Development"
          buttonComponent={
            <button
              className={`${styles.newBoardButton} button`}
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className={styles.icon} /> New Boards
            </button>
          }
        />
      </div>

      {/* TABS */}
      <div className={`${styles.tabs} projectHeaderTabs`}>
        <div className={styles.tab}>
          <TabButton
            name="Board"
            icon={<Grid3x3 />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className={styles.actionButtons}>
          <button className={`${styles.iconButton} projectHeaderIconButton`}>
            <Filter />
          </button>
          <button className={`${styles.iconButton} projectHeaderIconButton`}>
            <Share2 />
          </button>
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Search Task"
              className={`${styles.searchInput} projectHeaderSearchInput`}
            />
            <Grid3x3 className={`${styles.searchIcon} searchIcon`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// TabButton component
type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton: React.FC<TabButtonProps> = ({
  name,
  icon,
  setActiveTab,
  activeTab,
}: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`${styles.tabButton} projectHeaderTabButton ${
        isActive ? "active" : ""
      } `}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
