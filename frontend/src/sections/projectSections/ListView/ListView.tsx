import { Task, useGetTasksQuery } from "../../../state/api";
import Header from "../../../components/Header/Header";
import styles from "./ListView.module.scss";
import TaskCard from "../../../components/TaskCard/TaskCard";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

export default function ListView({ id, setIsModalNewTaskOpen }: Props) {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;
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
        {tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
