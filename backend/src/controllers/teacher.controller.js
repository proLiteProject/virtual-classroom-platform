import {
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  listClassSubjects,
  createClassSubject,
  deleteClassSubject,
  listClassStudents,
  listStudents,
  addClassStudent,
  removeClassStudent,
  listMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  markMaterialRead,
  listMaterialReaders,
  listLiveClasses,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  listRecordings,
  createRecording,
  deleteRecording,
  listChatMessages,
  createChatMessage,
  listExams,
  createExam,
  updateExam,
  deleteExam,
  listMcqQuestions,
  createMcqQuestion,
  updateMcqQuestion,
  deleteMcqQuestion,
  listMcqOptions,
  createMcqOption,
  updateMcqOption,
  deleteMcqOption,
  listExamResults,
  upsertExamResult,
  updateExamResult,
  deleteExamResult,
  listStudentLogs,
  createStudentLog,
  deleteStudentLog
} from "../services/teacher.service.js";
import { ApiError } from "../utils/ApiError.js";

// Subjects
export const getSubjectsController = async (req, res, next) => {
  try {
    const data = await listSubjects();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSubjectController = async (req, res, next) => {
  try {
    const { subjectName } = req.body || {};
    if (!subjectName) throw new ApiError(400, "subjectName is required");
    const data = await createSubject(subjectName);
    res.status(201).json({ success: true, message: "Subject created", data });
  } catch (error) {
    next(error);
  }
};

export const updateSubjectController = async (req, res, next) => {
  try {
    const { subjectName } = req.body || {};
    if (!subjectName) throw new ApiError(400, "subjectName is required");
    const data = await updateSubject(req.params.id, subjectName);
    res.json({ success: true, message: "Subject updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteSubjectController = async (req, res, next) => {
  try {
    const data = await deleteSubject(req.params.id);
    res.json({ success: true, message: "Subject deleted", data });
  } catch (error) {
    next(error);
  }
};

// Class Subjects
export const getClassSubjectsController = async (req, res, next) => {
  try {
    const classId = req.query.class_id;
    if (!classId) throw new ApiError(400, "class_id is required");
    const data = await listClassSubjects(classId, req.user);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createClassSubjectController = async (req, res, next) => {
  try {
    const { classId, subjectId, teacherId, teacherUserId } = req.body || {};
    if (!classId || !subjectId) {
      throw new ApiError(400, "classId and subjectId are required");
    }
    const data = await createClassSubject(
      { classId, subjectId, teacherId, teacherUserId },
      req.user
    );
    res.status(201).json({ success: true, message: "Class subject created", data });
  } catch (error) {
    next(error);
  }
};

export const deleteClassSubjectController = async (req, res, next) => {
  try {
    const data = await deleteClassSubject(req.params.id, req.user);
    res.json({ success: true, message: "Class subject deleted", data });
  } catch (error) {
    next(error);
  }
};

// Class Students
export const getClassStudentsController = async (req, res, next) => {
  try {
    const classId = req.query.class_id;
    if (!classId) throw new ApiError(400, "class_id is required");
    const data = await listClassStudents(classId, req.user);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addClassStudentController = async (req, res, next) => {
  try {
    const { classId, studentId, studentUserId } = req.body || {};
    if (!classId) throw new ApiError(400, "classId is required");
    const data = await addClassStudent(
      { classId, studentId, studentUserId },
      req.user
    );
    res.status(201).json({ success: true, message: "Student enrolled", data });
  } catch (error) {
    next(error);
  }
};

export const listStudentsController = async (req, res, next) => {
  try {
    const data = await listStudents(req.query.search || "");
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const removeClassStudentController = async (req, res, next) => {
  try {
    const data = await removeClassStudent(req.params.id, req.user);
    res.json({ success: true, message: "Student removed", data });
  } catch (error) {
    next(error);
  }
};

// Materials
export const getMaterialsController = async (req, res, next) => {
  try {
    const { class_id, subject_id } = req.query;
    const data = await listMaterials(
      { classId: class_id, subjectId: subject_id },
      req.user
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createMaterialController = async (req, res, next) => {
  try {
    const {
      title,
      filePath,
      classId,
      subjectId,
      teacherId,
      teacherUserId
    } = req.body || {};
    const uploadedPath = req.file ? `/uploads/${req.file.filename}` : null;
    const finalPath = uploadedPath || filePath;
    if (!title || !finalPath || !classId || !subjectId) {
      throw new ApiError(400, "title, file or filePath, classId, subjectId are required");
    }
    const data = await createMaterial(
      { title, filePath: finalPath, classId, subjectId, teacherId, teacherUserId },
      req.user
    );
    res.status(201).json({ success: true, message: "Material created", data });
  } catch (error) {
    next(error);
  }
};

export const updateMaterialController = async (req, res, next) => {
  try {
    const { title, filePath, classId, subjectId } = req.body || {};
    const data = await updateMaterial(
      req.params.id,
      { title, filePath, classId, subjectId },
      req.user
    );
    res.json({ success: true, message: "Material updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteMaterialController = async (req, res, next) => {
  try {
    const data = await deleteMaterial(req.params.id);
    res.json({ success: true, message: "Material deleted", data });
  } catch (error) {
    next(error);
  }
};

export const markMaterialReadController = async (req, res, next) => {
  try {
    const data = await markMaterialRead(req.params.id, req.user.id);
    res.json({ success: true, message: "Marked as read", data });
  } catch (error) {
    next(error);
  }
};

export const listMaterialReadersController = async (req, res, next) => {
  try {
    const data = await listMaterialReaders(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Live Classes
export const getLiveClassesController = async (req, res, next) => {
  try {
    const data = await listLiveClasses(req.query.class_id, req.user);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createLiveClassController = async (req, res, next) => {
  try {
    const { classId, subjectId, startTime, endTime, teacherId, teacherUserId } = req.body || {};
    if (!classId || !subjectId) throw new ApiError(400, "classId and subjectId are required");
    const data = await createLiveClass(
      { classId, subjectId, startTime, endTime, teacherId, teacherUserId },
      req.user
    );
    res.status(201).json({ success: true, message: "Live class created", data });
  } catch (error) {
    next(error);
  }
};

export const updateLiveClassController = async (req, res, next) => {
  try {
    const { startTime, endTime, subjectId } = req.body || {};
    const data = await updateLiveClass(req.params.id, { startTime, endTime, subjectId }, req.user);
    res.json({ success: true, message: "Live class updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteLiveClassController = async (req, res, next) => {
  try {
    const data = await deleteLiveClass(req.params.id, req.user);
    res.json({ success: true, message: "Live class deleted", data });
  } catch (error) {
    next(error);
  }
};

// Recordings
export const getRecordingsController = async (req, res, next) => {
  try {
    const data = await listRecordings(req.query.class_id, req.user);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createRecordingController = async (req, res, next) => {
  try {
    const { classId, videoPath, teacherId, teacherUserId } = req.body || {};
    if (!classId || !videoPath) {
      throw new ApiError(400, "classId and videoPath are required");
    }
    const data = await createRecording(
      { classId, videoPath, teacherId, teacherUserId },
      req.user
    );
    res.status(201).json({ success: true, message: "Recording created", data });
  } catch (error) {
    next(error);
  }
};

export const deleteRecordingController = async (req, res, next) => {
  try {
    const data = await deleteRecording(req.params.id, req.user);
    res.json({ success: true, message: "Recording deleted", data });
  } catch (error) {
    next(error);
  }
};

// Chat
export const getChatMessagesController = async (req, res, next) => {
  try {
    const classId = req.query.class_id;
    if (!classId) throw new ApiError(400, "class_id is required");
    const data = await listChatMessages(classId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createChatMessageController = async (req, res, next) => {
  try {
    const { classId, message } = req.body || {};
    if (!classId || !message) throw new ApiError(400, "classId and message are required");
    const data = await createChatMessage({ classId, message }, req.user);
    res.status(201).json({ success: true, message: "Message sent", data });
  } catch (error) {
    next(error);
  }
};

// Exams
export const getExamsController = async (req, res, next) => {
  try {
    const data = await listExams({
      classId: req.query.class_id,
      subjectId: req.query.subject_id
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createExamController = async (req, res, next) => {
  try {
    const { classId, subjectId, examDate } = req.body || {};
    if (!classId || !subjectId) {
      throw new ApiError(400, "classId and subjectId are required");
    }
    const data = await createExam({ classId, subjectId, examDate }, req.user);
    res.status(201).json({ success: true, message: "Exam created", data });
  } catch (error) {
    next(error);
  }
};

export const updateExamController = async (req, res, next) => {
  try {
    const { examDate } = req.body || {};
    const data = await updateExam(req.params.id, { examDate }, req.user);
    res.json({ success: true, message: "Exam updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteExamController = async (req, res, next) => {
  try {
    const data = await deleteExam(req.params.id, req.user);
    res.json({ success: true, message: "Exam deleted", data });
  } catch (error) {
    next(error);
  }
};

// MCQ Questions
export const getMcqQuestionsController = async (req, res, next) => {
  try {
    const data = await listMcqQuestions({
      classId: req.query.class_id,
      subjectId: req.query.subject_id
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createMcqQuestionController = async (req, res, next) => {
  try {
    const { classId, subjectId, questionText } = req.body || {};
    if (!classId || !subjectId || !questionText) {
      throw new ApiError(400, "classId, subjectId, questionText are required");
    }
    const data = await createMcqQuestion({ classId, subjectId, questionText }, req.user);
    res.status(201).json({ success: true, message: "MCQ question created", data });
  } catch (error) {
    next(error);
  }
};

export const updateMcqQuestionController = async (req, res, next) => {
  try {
    const { questionText } = req.body || {};
    if (!questionText) throw new ApiError(400, "questionText is required");
    const data = await updateMcqQuestion(req.params.id, { questionText }, req.user);
    res.json({ success: true, message: "MCQ question updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteMcqQuestionController = async (req, res, next) => {
  try {
    const data = await deleteMcqQuestion(req.params.id, req.user);
    res.json({ success: true, message: "MCQ question deleted", data });
  } catch (error) {
    next(error);
  }
};

// MCQ Options
export const getMcqOptionsController = async (req, res, next) => {
  try {
    const questionId = req.query.question_id;
    if (!questionId) throw new ApiError(400, "question_id is required");
    const data = await listMcqOptions(questionId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createMcqOptionController = async (req, res, next) => {
  try {
    const { questionId, optionText, isCorrect } = req.body || {};
    if (!questionId || !optionText) {
      throw new ApiError(400, "questionId and optionText are required");
    }
    const data = await createMcqOption({ questionId, optionText, isCorrect });
    res.status(201).json({ success: true, message: "MCQ option created", data });
  } catch (error) {
    next(error);
  }
};

export const updateMcqOptionController = async (req, res, next) => {
  try {
    const { optionText, isCorrect } = req.body || {};
    if (!optionText) throw new ApiError(400, "optionText is required");
    const data = await updateMcqOption(req.params.id, { optionText, isCorrect });
    res.json({ success: true, message: "MCQ option updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteMcqOptionController = async (req, res, next) => {
  try {
    const data = await deleteMcqOption(req.params.id);
    res.json({ success: true, message: "MCQ option deleted", data });
  } catch (error) {
    next(error);
  }
};

// Exam Results
export const getExamResultsController = async (req, res, next) => {
  try {
    const data = await listExamResults({
      examId: req.query.exam_id,
      studentId: req.query.student_id
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const upsertExamResultController = async (req, res, next) => {
  try {
    const { examId, studentId, studentUserId, score } = req.body || {};
    if (!examId || score === undefined) {
      throw new ApiError(400, "examId and score are required");
    }
    const data = await upsertExamResult({ examId, studentId, studentUserId, score });
    res.status(201).json({ success: true, message: "Exam result saved", data });
  } catch (error) {
    next(error);
  }
};

export const updateExamResultController = async (req, res, next) => {
  try {
    const { score } = req.body || {};
    if (score === undefined) throw new ApiError(400, "score is required");
    const data = await updateExamResult(req.params.id, score);
    res.json({ success: true, message: "Exam result updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteExamResultController = async (req, res, next) => {
  try {
    const data = await deleteExamResult(req.params.id);
    res.json({ success: true, message: "Exam result deleted", data });
  } catch (error) {
    next(error);
  }
};

// Student Logs
export const getStudentLogsController = async (req, res, next) => {
  try {
    const data = await listStudentLogs({ studentId: req.query.student_id });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createStudentLogController = async (req, res, next) => {
  try {
    const { studentId, studentUserId, logType, description } = req.body || {};
    if (!logType || !description) {
      throw new ApiError(400, "logType and description are required");
    }
    const data = await createStudentLog({ studentId, studentUserId, logType, description });
    res.status(201).json({ success: true, message: "Student log created", data });
  } catch (error) {
    next(error);
  }
};

export const deleteStudentLogController = async (req, res, next) => {
  try {
    const data = await deleteStudentLog(req.params.id);
    res.json({ success: true, message: "Student log deleted", data });
  } catch (error) {
    next(error);
  }
};
