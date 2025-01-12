import React, { useState } from "react";
import { format } from "date-fns";
import styles from "./TaskCard.module.scss";
import { Task } from "../../state/api";
import { useAppSelector } from "../../store/redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

type Props = {
  task: Task;
  onDelete?: (id: number) => void;
};

const TaskCard: React.FC<Props> = ({ task, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleDeleteConfirm = () => {
    onDelete && onDelete(task.id);
    setIsDialogOpen(false);
  };

  return (
    <div className={`${styles.taskCard} taskCard`}>
      {/* Delete Confirmation Modal */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "{task.title}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Button */}
      {onDelete ? (
        <button
          className={`${styles.deleteButton} ${
            isDarkMode ? styles.buttonColorDark : styles.buttonColor
          }`}
          onClick={handleDialogOpen}
          aria-label="Delete task"
        >
          -
        </button>
      ) : (
        ""
      )}

      {task.image !== null && (
        <div className={styles.attachments}>
          <div className={styles.attachmentsList}>
            <img
              src={`${task.image}`}
              alt={task.title}
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
