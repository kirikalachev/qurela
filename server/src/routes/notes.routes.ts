import { Router } from "express";
import * as notesController from "../controllers/notes.controller.js";
import { authMiddleware } from "../middleware/authenticate.js";

const router = Router();

router.use(authMiddleware);

router.get("/", notesController.getNotes);
router.get("/:id", notesController.getNote);
router.post("/", notesController.createNote);
router.put("/:id", notesController.updateNote);
router.delete("/:id", notesController.deleteNote);

export default router;