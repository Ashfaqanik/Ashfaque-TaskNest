import { getUser, getUsers } from "../controllers/userController";
import { Router } from "express";

const router = Router();

//router.post("register", upload.single("image"), createUser);
//router.post("/login", loginUser);
router.get("/:userId", getUser);
router.get("/users", getUsers);

export default router;
