import { Router } from "express";
import {
  createProject,
  getProjects,
  searchProject,
} from "../controllers/projectController";

const router = Router();
router.get("/", getProjects);

router.post("/", createProject);
router.get("/search", searchProject);

export default router;
