import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.use(authMiddleware);
router.use(authorize("ADMIN"));

router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.delete("/users/:id", adminController.deleteUser);

router.get("/notes", adminController.getAllNotes);
router.get("/notes/:id", adminController.getNoteById);
router.put("/notes/:id", adminController.updateNote);
router.delete("/notes/:id", adminController.deleteNote);

router.get("/stats", adminController.getStats);

export default router;