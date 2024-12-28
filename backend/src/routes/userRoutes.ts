import {
  getUser,
  getUsers,
  registerUser,
  loginUser,
  updateUser,
} from "../controllers/userController";
import { Router } from "express";
import { authenticateToken } from "./auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", authenticateToken, getUser);
router.get("/", getUsers);
router.patch("/update/:id", authenticateToken, updateUser);

export default router;
