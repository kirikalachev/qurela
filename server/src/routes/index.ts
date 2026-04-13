import { Router } from "express";
import authRoutes from "./auth.routes.js";
import notesRoutes from "./notes.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/notes", notesRoutes);
router.use("/admin", adminRoutes);

export default router;