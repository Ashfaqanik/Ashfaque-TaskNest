import multer from "multer";
import { getUser } from "../controllers/userController";
import { Router } from "express";

const router = Router();
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage });

//router.post("register", upload.single("image"), createUser);
//router.post("/login", loginUser);
router.get("/:userId", getUser);
//router.get("/image/:id", retrieveUserImage);

export default router;
