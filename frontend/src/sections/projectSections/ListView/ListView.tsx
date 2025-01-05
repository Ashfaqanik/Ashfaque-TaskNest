import {
  Task,
  useGetTasksByPriorityQuery,
  useGetTasksQuery,
  useSearchTasksResultsQuery,
} from "../../../state/api";
import Header from "../../../components/Header/Header";
import styles from "./ListView.module.scss";
import TaskCard from "../../../components/TaskCard/TaskCard";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  priority?: string;
  query?: string;
};

export default function ListView({
  id,
  setIsModalNewTaskOpen,
  priority = "",
  query = "",
}: Props) {
  const {
    data: tasks,
    error: tasksError,
    isLoading: isTasksLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

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

  if (priority === "" && isTasksLoading) return <div>Loading...</div>;
  if (priority !== "" && isPriorityTasksLoading) return <div>Loading...</div>;
  if (query !== "" && isSearchTasksLoading) return <div>Loading...</div>;

  if (priority === "" && query === "" && tasksError) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (priority !== "" && priorityTasksError) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (query !== "" && searchTasksError) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (!displayTasks?.length) {
    return <div className={styles.noTasksMessage}>No task found.</div>;
  }
  return (
    <div className={styles.listContainer}>
      <div>
        <Header
          name="Task List"
          buttonComponent={
            <button
              className={`${styles.headerButton} roundButton`}
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              +
            </button>
          }
          isSmallText
        />
      </div>
      <div className={styles.tasksGrid}>
        {displayTasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
