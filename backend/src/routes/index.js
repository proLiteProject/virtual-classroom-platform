// routes/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import classroomRoutes from "./class.routes.js";
import userRoutes from "./user.routes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/classrooms", classroomRoutes);
router.use("/admin", adminRoutes);

export default router;