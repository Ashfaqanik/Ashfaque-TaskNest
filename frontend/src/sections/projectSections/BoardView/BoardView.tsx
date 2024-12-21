import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import CommentModal from "../../../components/CommentModel/CommentModel";
import {
  Comment,
  Task as TaskType,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "../../../state/api";

import { MessageSquareMore, Plus } from "lucide-react";
import styles from "./BoardView.module.scss";
import { useEffect, useState } from "react";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

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
            tasks={tasks || []}
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
          {/* <button className="columnActionsButton">
            <EllipsisVertical size={20} />
          </button> */}
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
          <div
            className={`${styles.taskComments} taskComments`}
            onClick={() => setIsModalOpen(true)}
            //style={{ cursor: "pointer" }}
          >
            <MessageSquareMore size={20} />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CommentModal
          taskName={task.title}
          taskId={task.id}
          projectId={task.projectId}
          userId={1}
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
