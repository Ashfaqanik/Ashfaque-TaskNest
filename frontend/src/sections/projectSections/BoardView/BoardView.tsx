import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import CommentModal from "../../../components/CommentModel/CommentModel";
import {
  Task as TaskType,
  useGetProfileQuery,
  useGetTasksByPriorityQuery,
  useGetTasksQuery,
  useSearchTasksResultsQuery,
  useUpdateTaskStatusMutation,
} from "../../../state/api";

import { MessageSquareMore, Plus } from "lucide-react";
import styles from "./BoardView.module.scss";
import { useState } from "react";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  priority?: string;
  query?: string;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({
  id,
  setIsModalNewTaskOpen,
  priority = "",
  query = "",
}: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          marginTop: "1rem",
          color: "#223344",
        }}
      >
        Project
      </div>
      <div className={styles.grid}>
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={displayTasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({ isOver: !!monitor.isOver() }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`${styles.taskColumn} taskColumnBackground ${
        isOver ? styles.over : ""
      }`}
    >
      <div className={styles.columnHeader}>
        <h3 className={styles[status.toLowerCase().replace(/\s+/g, "")]}>
          {status}{" "}
          <span className={`${styles.taskCount} taskCount`}>{tasksCount}</span>
        </h3>
        <div className={styles.columnActions}>
          <button
            className="columnActionsButton"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const { data: user, isLoading, isError } = useGetProfileQuery();

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<string[]>(
    task?.comments?.map((comment) => comment.text) || []
  );

  return (
    <div
      ref={drag}
      className={`${styles.task} taskBox ${isDragging ? styles.dragging : ""}`}
    >
      {task.image && (
        <img
          src={`${task.image}`}
          width={300}
          height={150}
          className={styles.taskImage}
        />
      )}
      <div className={styles.taskContent}>
        <div className={styles.taskHeader}>
          <div className={styles.taskTags}>
            {task.priority && (
              <div
                className={`${styles.priority} ${
                  styles[`priority--${task.priority.toLowerCase()}`]
                }`}
              >
                {task.priority}
              </div>
            )}
            {taskTagsSplit.map((tag) => (
              <div key={tag} className={styles.taskTag}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.taskTitle}>
          <h4>{task.title}</h4>
        </div>

        <div className={`${styles.taskDates} taskDatesColor`}>
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className={`${styles.taskDescription} taskDescription`}>
          {task.description}
        </p>

        <div className={styles.taskFooter}>
          <div className={styles.taskUsers}>
            {task.assignee && (
              <img
                key={task.assignee.userId}
                src={
                  task.assignee.image === ""
                    ? "/default.png"
                    : task.assignee.image
                }
                alt={task.assignee.username}
                width={30}
                height={30}
                className={styles.picture}
              />
            )}
            {task.author && (
              <img
                key={task.author.userId}
                src={
                  task.author.image === "" ? "/default.png" : task.author.image
                }
                alt={task.author.username}
                width={30}
                height={30}
                className={styles.picture}
              />
            )}
          </div>
          <div
            className={`${styles.taskComments} taskComments`}
            onClick={() => setIsModalOpen(true)}
          >
            <MessageSquareMore size={20} />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {user && isModalOpen && (
        <CommentModal
          taskName={task.title}
          taskId={task.id}
          projectId={task.projectId}
          userId={user?.userId}
          userName={user?.username}
          image={user?.image}
          onClose={() => setIsModalOpen(false)}
          onCommentPosted={(newText) =>
            setComments((text) => [...text, newText])
          }
        />
      )}
    </div>
  );
};

export default BoardView;
