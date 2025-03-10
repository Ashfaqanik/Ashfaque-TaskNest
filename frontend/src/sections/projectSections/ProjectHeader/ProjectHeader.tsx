import React, { useState } from "react";
import Header from "../../../components/Header/Header";
import { useAppSelector } from "../../../store/redux";
import { useProject } from "../../../context/ProjectContext";
import { Clock, Filter, Grid3x3, List, PlusSquare, Table } from "lucide-react";
import ModalNewProject from "../ModalNewProject/ModalNewProject";
import styles from "./ProjectHeader.module.scss";
import FilterButton from "../../../components/FilterButton/FilterButton";

// Defined types for Props
type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  setPriority: (priorityName: string) => void;
  setQuery: (query: string) => void;
};

const ProjectHeader: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  setPriority,
  setQuery,
}: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] =
    useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const { projectName, teamId } = useProject();

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setPriority(selectedFilter);
  };
  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

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
          name={
            projectName && teamId
              ? `${projectName} - Team ${teamId}`
              : "Project Development"
          }
          buttonComponent={
            <button
              className={`${styles.newBoardButton} button`}
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className={styles.icon} /> New Project
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
          <FilterButton
            className={"projectHeaderIconButton"}
            onFilterChange={handleFilterChange}
          >
            <Filter />
          </FilterButton>

          <div className={styles.search}>
            <input
              type="text"
              placeholder="Search Task"
              onChange={handleSearchQuery}
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
