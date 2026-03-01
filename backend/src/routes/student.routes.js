import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeMinRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../config/roles.js";
import {
  getStudentClassesController,
  getStudentClassSubjectsController,
  getStudentMaterialsController,
  markStudentMaterialReadController
} from "../controllers/student.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(authorizeMinRole(ROLES.STUDENT));

router.get("/classes", getStudentClassesController);
router.get("/class-subjects", getStudentClassSubjectsController);
router.get("/materials", getStudentMaterialsController);
router.post("/materials/:id/read", markStudentMaterialReadController);

export default router;
