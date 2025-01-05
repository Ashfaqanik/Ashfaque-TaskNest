import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  getUserTasks,
  postComment,
  getTasksByPriority,
  searchTasks,
} from "../controllers/taskController";
import { authenticateToken } from "./auth";

const router = Router();

router.get("/", getTasks);
router.get("/priority", getTasksByPriority);
router.post("/", createTask);
router.patch("/:taskId/status", authenticateToken, updateTaskStatus);
router.get("/user/:userId", getUserTasks);
router.post("/:taskId/comments", postComment);
router.get("/search", searchTasks);

export default router;
