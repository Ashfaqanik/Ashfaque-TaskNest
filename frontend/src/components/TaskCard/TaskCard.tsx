import React from "react";
import { format } from "date-fns";
import styles from "./TaskCard.module.scss";
import { Task } from "../../state/api";

type Props = {
  task: Task;
};

const TaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className={`${styles.taskCard} taskCard`}>
      {task.attachments && task.attachments.length > 0 && (
        <div className={styles.attachments}>
          {/* <strong>Attachments:</strong> */}
          <div className={styles.attachmentsList}>
            <img
              src={`/${task.attachments[0].fileURL}`}
              alt={task.attachments[0].fileName}
              className={styles.attachmentImage}
            />
          </div>
        </div>
      )}
      <p>
        <strong>ID:</strong> {task.id}
      </p>
      <p>
        <strong>Title:</strong> {task.title}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {task.description || "No description provided"}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority}
      </p>
      <p>
        <strong>Tags:</strong> {task.tags || "No tags"}
      </p>
      <p>
        <strong>Start Date:</strong>{" "}
        {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
      </p>
      <p>
        <strong>Due Date:</strong>{" "}
        {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
      </p>
      <p>
        <strong>Author:</strong>{" "}
        {task.author ? task.author.username : "Unknown"}
      </p>
      <p>
        <strong>Assignee:</strong>{" "}
        {task.assignee ? task.assignee.username : "Unassigned"}
      </p>
    </div>
  );
};

export default TaskCard;
