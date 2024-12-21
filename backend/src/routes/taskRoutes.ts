import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  getUserTasks,
  postComment,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.get("/user/:userId", getUserTasks);
router.post("/:taskId/comments", postComment);

export default router;
