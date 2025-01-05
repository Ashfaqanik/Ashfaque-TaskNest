import React, { useMemo, useState } from "react";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import {
  useGetTasksByPriorityQuery,
  useGetTasksQuery,
  useSearchTasksResultsQuery,
} from "../../../state/api";
import styles from "./TimelineView.module.scss";
import { useAppSelector } from "../../../store/redux";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  priority?: string;
  query?: string;
};

type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView: React.FC<Props> = ({
  id,
  setIsModalNewTaskOpen,
  priority = "",
  query = "",
}) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({
    projectId: Number(id),
  });

  const {
    data: priorityTasks,
    error: priorityTasksError,
    isLoading: isPriorityTasksLoading,
  } = useGetTasksByPriorityQuery(
    {
      projectId: Number(id),
      priority,
    },
    {
      skip: priority === "",
    }
  );
  const {
    data: searchTasks,
    error: searchTasksError,
    isLoading: isSearchTasksLoading,
  } = useSearchTasksResultsQuery(
    {
      projectId: Number(id),
      query,
    },
    {
      skip: query === "",
    }
  );

  const displayTasks =
    priority !== "" ? priorityTasks : query !== "" ? searchTasks : tasks;
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    if (!displayTasks || displayTasks.length === 0) {
      return [];
    }
    return (
      displayTasks?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [displayTasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };
  if (priority === "" && isLoading) return <div>Loading...</div>;
  if (priority !== "" && isPriorityTasksLoading) return <div>Loading...</div>;
  if (query !== "" && isSearchTasksLoading) return <div>Loading...</div>;

  if (priority === "" && query === "" && error) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (priority !== "" && priorityTasksError) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (query !== "" && searchTasksError) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (!ganttTasks.length) {
    return (
      <div className={styles.noTasksMessage}>
        No tasks available for the selected priority.
      </div>
    );
  }
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
