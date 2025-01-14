import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import { useGetProjectsQuery } from "../../state/api";
import { useMemo, useState } from "react";
import styles from "./Timeline.module.scss";
import Header from "../../components/Header/Header";
import { useAppSelector } from "../../store/redux";

type TaskTypeItems = "task" | "milestone" | "project";
const Timeline = () => {
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isMobile = window.innerWidth < 768;

  const ganttTasks = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
        isDisabled: false,
      })) || []
    );
  }, [projects]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects)
    return <div>An error occurred while fetching projects</div>;

  if (ganttTasks.length === 0) {
    return <div>No tasks available to display.</div>;
  }

  return (
    <div className={`${styles.timelineContainer} timeline`}>
      <header className={styles.header}>
        <Header name="Projects Timeline" />
        <div className={styles.viewMode}>
          <select
            className={`${styles.select} ${isDarkMode ? styles.dark : ""}`}
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>
        </div>
      </header>

      <div
        className={`${styles.timelineSection} ${isDarkMode ? styles.dark : ""}`}
      >
        <Gantt
          tasks={ganttTasks}
          {...displayOptions}
          columnWidth={
            isMobile
              ? 70
              : displayOptions.viewMode === ViewMode.Month
              ? 150
              : 100
          }
          listCellWidth={isMobile ? "60px" : "100px"}
          projectBackgroundColor={isDarkMode ? "#4666b1" : "#77a6d4"}
          projectProgressColor={isDarkMode ? "#96bff2" : "#4f5c69"}
          projectBackgroundSelectedColor={isDarkMode ? "#25619c" : "#5ba8e8"}
          projectProgressSelectedColor={isDarkMode ? "#5585b4" : "#8ad1aa"}
        />
      </div>
    </div>
  );
};
export default Timeline;
