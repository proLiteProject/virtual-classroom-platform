import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeMinRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../config/roles.js";
import {
  getSubjectsController,
  createSubjectController,
  updateSubjectController,
  deleteSubjectController,
  getClassSubjectsController,
  createClassSubjectController,
  deleteClassSubjectController,
  getClassStudentsController,
  listStudentsController,
  addClassStudentController,
  removeClassStudentController,
  getMaterialsController,
  createMaterialController,
  updateMaterialController,
  deleteMaterialController,
  markMaterialReadController,
  listMaterialReadersController,
  getLiveClassesController,
  createLiveClassController,
  updateLiveClassController,
  deleteLiveClassController,
  getRecordingsController,
  createRecordingController,
  deleteRecordingController,
  getChatMessagesController,
  createChatMessageController,
  getExamsController,
  createExamController,
  updateExamController,
  deleteExamController,
  getMcqQuestionsController,
  createMcqQuestionController,
  updateMcqQuestionController,
  deleteMcqQuestionController,
  getMcqOptionsController,
  createMcqOptionController,
  updateMcqOptionController,
  deleteMcqOptionController,
  getExamResultsController,
  upsertExamResultController,
  updateExamResultController,
  deleteExamResultController,
  getStudentLogsController,
  createStudentLogController,
  deleteStudentLogController
} from "../controllers/teacher.controller.js";
import { uploadPdf } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(authenticate);

// Subjects
router.get("/subjects", getSubjectsController);
router.post("/subjects", authorizeMinRole(ROLES.TEACHER), createSubjectController);
router.put("/subjects/:id", authorizeMinRole(ROLES.TEACHER), updateSubjectController);
router.delete("/subjects/:id", authorizeMinRole(ROLES.TEACHER), deleteSubjectController);

// Class subjects
router.get("/class-subjects", authorizeMinRole(ROLES.TEACHER), getClassSubjectsController);
router.post("/class-subjects", authorizeMinRole(ROLES.TEACHER), createClassSubjectController);
router.delete("/class-subjects/:id", authorizeMinRole(ROLES.TEACHER), deleteClassSubjectController);

// Class students
router.get("/class-students", authorizeMinRole(ROLES.TEACHER), getClassStudentsController);
router.get("/students", authorizeMinRole(ROLES.TEACHER), listStudentsController);
router.post("/class-students", authorizeMinRole(ROLES.TEACHER), addClassStudentController);
router.delete("/class-students/:id", authorizeMinRole(ROLES.TEACHER), removeClassStudentController);

// Materials
router.get("/materials", authorizeMinRole(ROLES.TEACHER), getMaterialsController);
router.post(
  "/materials",
  authorizeMinRole(ROLES.TEACHER),
  uploadPdf.single("file"),
  createMaterialController
);
router.put("/materials/:id", authorizeMinRole(ROLES.TEACHER), updateMaterialController);
router.delete("/materials/:id", authorizeMinRole(ROLES.TEACHER), deleteMaterialController);
router.post("/materials/:id/read", markMaterialReadController);
router.get("/materials/:id/readers", authorizeMinRole(ROLES.TEACHER), listMaterialReadersController);

// Live classes
router.get("/live-classes", authorizeMinRole(ROLES.TEACHER), getLiveClassesController);
router.post("/live-classes", authorizeMinRole(ROLES.TEACHER), createLiveClassController);
router.put("/live-classes/:id", authorizeMinRole(ROLES.TEACHER), updateLiveClassController);
router.delete("/live-classes/:id", authorizeMinRole(ROLES.TEACHER), deleteLiveClassController);

// Recordings
router.get("/recordings", authorizeMinRole(ROLES.TEACHER), getRecordingsController);
router.post("/recordings", authorizeMinRole(ROLES.TEACHER), createRecordingController);
router.delete("/recordings/:id", authorizeMinRole(ROLES.TEACHER), deleteRecordingController);

// Chat
router.get("/chat-messages", getChatMessagesController);
router.post("/chat-messages", createChatMessageController);

// Exams
router.get("/exams", authorizeMinRole(ROLES.TEACHER), getExamsController);
router.post("/exams", authorizeMinRole(ROLES.TEACHER), createExamController);
router.put("/exams/:id", authorizeMinRole(ROLES.TEACHER), updateExamController);
router.delete("/exams/:id", authorizeMinRole(ROLES.TEACHER), deleteExamController);

// MCQ
router.get("/mcq-questions", authorizeMinRole(ROLES.TEACHER), getMcqQuestionsController);
router.post("/mcq-questions", authorizeMinRole(ROLES.TEACHER), createMcqQuestionController);
router.put("/mcq-questions/:id", authorizeMinRole(ROLES.TEACHER), updateMcqQuestionController);
router.delete("/mcq-questions/:id", authorizeMinRole(ROLES.TEACHER), deleteMcqQuestionController);

router.get("/mcq-options", authorizeMinRole(ROLES.TEACHER), getMcqOptionsController);
router.post("/mcq-options", authorizeMinRole(ROLES.TEACHER), createMcqOptionController);
router.put("/mcq-options/:id", authorizeMinRole(ROLES.TEACHER), updateMcqOptionController);
router.delete("/mcq-options/:id", authorizeMinRole(ROLES.TEACHER), deleteMcqOptionController);

// Exam results
router.get("/exam-results", authorizeMinRole(ROLES.TEACHER), getExamResultsController);
router.post("/exam-results", authorizeMinRole(ROLES.TEACHER), upsertExamResultController);
router.put("/exam-results/:id", authorizeMinRole(ROLES.TEACHER), updateExamResultController);
router.delete("/exam-results/:id", authorizeMinRole(ROLES.TEACHER), deleteExamResultController);

// Student logs
router.get("/student-logs", authorizeMinRole(ROLES.TEACHER), getStudentLogsController);
router.post("/student-logs", authorizeMinRole(ROLES.TEACHER), createStudentLogController);
router.delete("/student-logs/:id", authorizeMinRole(ROLES.TEACHER), deleteStudentLogController);

export default router;
