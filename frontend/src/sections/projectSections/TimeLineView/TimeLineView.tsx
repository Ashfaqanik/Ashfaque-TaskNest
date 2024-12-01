import React, { useMemo, useState } from "react";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useGetTasksQuery } from "../../../state/api";
import styles from "./TimelineView.module.scss";
import { useAppSelector } from "../../../store/redux";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView: React.FC<Props> = ({ id, setIsModalNewTaskOpen }) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({
    projectId: Number(id),
  });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error || !tasks)
    return (
      <div className={styles.error}>An error occurred while fetching tasks</div>
    );

  return (
    <div className={`${styles.timelineContainer} timeline`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Project Tasks Timeline</h1>
        <div className={styles.lastPart}>
          <button
            className={`${styles.addButton} roundButton`}
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            +
          </button>
          <select
            className={`${styles.select} ${
              isDarkMode
                ? styles.selectBackgroundDark
                : styles.selectBackgroundLight
            }`}
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? styles.ganttContainerDark : styles.ganttContainer
        }`}
      >
        <Gantt
          tasks={ganttTasks}
          {...displayOptions}
          columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
          listCellWidth="100px"
          barBackgroundColor={isDarkMode ? "#4666b1" : "#77a6d4"}
          barBackgroundSelectedColor={isDarkMode ? "#3e64e4" : "#1f7ede"}
        />
      </div>
    </div>
  );
};

export default TimelineView;
