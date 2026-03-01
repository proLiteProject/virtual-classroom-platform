import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ROLES } from "../config/roles.js";

const getTeacherIdForUser = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id FROM teachers WHERE user_id = ?",
    [userId]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Teacher profile not found");
  }
  return rows[0].id;
};

const getStudentIdForUser = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id FROM students WHERE user_id = ?",
    [userId]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Student profile not found");
  }
  return rows[0].id;
};

const resolveTeacherId = async (user, teacherUserId, teacherId) => {
  if (user.role === ROLES.TEACHER) {
    return getTeacherIdForUser(user.id);
  }
  if (teacherId) return teacherId;
  if (teacherUserId) return getTeacherIdForUser(teacherUserId);
  throw new ApiError(400, "teacherId or teacherUserId is required");
};

const resolveStudentId = async (studentUserId, studentId) => {
  if (studentId) {
    const [rows] = await pool.query("SELECT id FROM students WHERE id = ?", [
      studentId,
    ]);
    if (rows.length > 0) return studentId;
  }
  if (studentUserId) return getStudentIdForUser(studentUserId);
  throw new ApiError(400, "studentId or studentUserId is required");
};

const ensureClassOwnership = async (user, classId) => {
  if (user.role === ROLES.ADMIN) return;
  const [rows] = await pool.query(
    "SELECT id FROM classes WHERE id = ? AND teacher_id = ?",
    [classId, user.id]
  );
  if (rows.length === 0) {
    throw new ApiError(403, "You can only access your own classes");
  }
};

// Subjects
export const listSubjects = async () => {
  const [rows] = await pool.query(
    "SELECT id, subject_name FROM subjects ORDER BY subject_name ASC"
  );
  return rows;
};

export const createSubject = async (subjectName) => {
  const [result] = await pool.query(
    "INSERT INTO subjects (subject_name) VALUES (?)",
    [subjectName]
  );
  return { id: result.insertId, subject_name: subjectName };
};

export const updateSubject = async (id, subjectName) => {
  const [result] = await pool.query(
    "UPDATE subjects SET subject_name = ? WHERE id = ?",
    [subjectName, id]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Subject not found");
  }
  return { id, subject_name: subjectName };
};

export const deleteSubject = async (id) => {
  const [result] = await pool.query("DELETE FROM subjects WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Subject not found");
  }
  return { id };
};

// Class Subjects
export const listClassSubjects = async (classId, user) => {
  await ensureClassOwnership(user, classId);
  const [rows] = await pool.query(
    `SELECT cs.id, cs.class_id, cs.subject_id, cs.teacher_id, s.subject_name
     FROM class_subjects cs
     JOIN subjects s ON cs.subject_id = s.id
     WHERE cs.class_id = ?`,
    [classId]
  );
  return rows;
};

export const createClassSubject = async (payload, user) => {
  await ensureClassOwnership(user, payload.classId);
  const teacherId = await resolveTeacherId(
    user,
    payload.teacherUserId,
    payload.teacherId
  );
  const [result] = await pool.query(
    "INSERT INTO class_subjects (class_id, subject_id, teacher_id) VALUES (?, ?, ?)",
    [payload.classId, payload.subjectId, teacherId]
  );
  return {
    id: result.insertId,
    class_id: payload.classId,
    subject_id: payload.subjectId,
    teacher_id: teacherId,
  };
};

export const deleteClassSubject = async (id, user) => {
  const [rows] = await pool.query(
    "SELECT class_id FROM class_subjects WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Class subject not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  await pool.query("DELETE FROM class_subjects WHERE id = ?", [id]);
  return { id };
};

// Class Students
export const listClassStudents = async (classId, user) => {
  await ensureClassOwnership(user, classId);
  const [rows] = await pool.query(
    `SELECT cs.id, cs.class_id, s.id AS student_id, u.id AS user_id,
            u.name, u.email, s.roll_no, s.phone
     FROM class_students cs
     JOIN students s ON cs.student_id = s.id
     JOIN users u ON s.user_id = u.id
     WHERE cs.class_id = ?`,
    [classId]
  );
  return rows;
};

export const listStudents = async (search = "") => {
  const like = `%${search}%`;
  const [rows] = await pool.query(
    `SELECT s.id AS student_id, u.id AS user_id, u.name, u.email, s.roll_no, s.phone
     FROM students s
     JOIN users u ON s.user_id = u.id
     WHERE u.name LIKE ? OR u.email LIKE ? OR s.roll_no LIKE ?
     ORDER BY u.name ASC`,
    [like, like, like]
  );
  return rows;
};

export const addClassStudent = async (payload, user) => {
  await ensureClassOwnership(user, payload.classId);
  const studentId = await resolveStudentId(
    payload.studentUserId,
    payload.studentId
  );
  const [result] = await pool.query(
    "INSERT INTO class_students (class_id, student_id) VALUES (?, ?)",
    [payload.classId, studentId]
  );
  return { id: result.insertId, class_id: payload.classId, student_id: studentId };
};

export const removeClassStudent = async (id, user) => {
  const [rows] = await pool.query(
    "SELECT class_id FROM class_students WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Class student not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  await pool.query("DELETE FROM class_students WHERE id = ?", [id]);
  return { id };
};

// Materials
export const listMaterials = async (filters, user) => {
  if (filters.classId) {
    await ensureClassOwnership(user, filters.classId);
  }
  const where = [];
  const params = [];
  if (filters.classId) {
    where.push("mcm.class_id = ?");
    params.push(filters.classId);
  }
  if (filters.subjectId) {
    where.push("mcm.subject_id = ?");
    params.push(filters.subjectId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT m.id, m.title, m.file_path, m.uploaded_by, m.created_at,
            mcm.class_id, mcm.subject_id
     FROM materials m
     JOIN material_class_map mcm ON m.id = mcm.material_id
     ${whereClause}
     ORDER BY m.created_at DESC`,
    params
  );
  return rows;
};

export const createMaterial = async (payload, user) => {
  await ensureClassOwnership(user, payload.classId);
  const teacherId = await resolveTeacherId(
    user,
    payload.teacherUserId,
    payload.teacherId
  );
  const [materialResult] = await pool.query(
    "INSERT INTO materials (title, file_path, uploaded_by) VALUES (?, ?, ?)",
    [payload.title, payload.filePath, teacherId]
  );
  const materialId = materialResult.insertId;
  await pool.query(
    "INSERT INTO material_class_map (material_id, class_id, subject_id) VALUES (?, ?, ?)",
    [materialId, payload.classId, payload.subjectId]
  );
  return {
    id: materialId,
    title: payload.title,
    file_path: payload.filePath,
    class_id: payload.classId,
    subject_id: payload.subjectId,
  };
};

export const updateMaterial = async (id, payload, user) => {
  if (payload.classId) {
    await ensureClassOwnership(user, payload.classId);
  }
  const updates = [];
  const params = [];
  if (payload.title) {
    updates.push("title = ?");
    params.push(payload.title);
  }
  if (payload.filePath) {
    updates.push("file_path = ?");
    params.push(payload.filePath);
  }
  if (updates.length > 0) {
    const [result] = await pool.query(
      `UPDATE materials SET ${updates.join(", ")} WHERE id = ?`,
      [...params, id]
    );
    if (result.affectedRows === 0) {
      throw new ApiError(404, "Material not found");
    }
  }
  if (payload.classId || payload.subjectId) {
    const mapUpdates = [];
    const mapParams = [];
    if (payload.classId) {
      mapUpdates.push("class_id = ?");
      mapParams.push(payload.classId);
    }
    if (payload.subjectId) {
      mapUpdates.push("subject_id = ?");
      mapParams.push(payload.subjectId);
    }
    await pool.query(
      `UPDATE material_class_map SET ${mapUpdates.join(", ")} WHERE material_id = ?`,
      [...mapParams, id]
    );
  }
  return { id };
};

export const deleteMaterial = async (id) => {
  const [result] = await pool.query("DELETE FROM materials WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Material not found");
  }
  return { id };
};

export const markMaterialRead = async (materialId, studentUserId) => {
  const studentId = await getStudentIdForUser(studentUserId);
  await pool.query(
    "INSERT IGNORE INTO material_read_log (material_id, student_id, status) VALUES (?, ?, 'READ')",
    [materialId, studentId]
  );
  return { material_id: materialId, student_id: studentId };
};

export const listMaterialReaders = async (materialId) => {
  const [rows] = await pool.query(
    `SELECT mrl.id, mrl.read_at, s.id AS student_id, u.name, u.email
     FROM material_read_log mrl
     JOIN students s ON mrl.student_id = s.id
     JOIN users u ON s.user_id = u.id
     WHERE mrl.material_id = ?
     ORDER BY mrl.read_at DESC`,
    [materialId]
  );
  return rows;
};

// Live Classes
export const listLiveClasses = async (classId, user) => {
  if (classId) {
    await ensureClassOwnership(user, classId);
  }
  const where = [];
  const params = [];
  if (classId) {
    where.push("class_id = ?");
    params.push(classId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT lc.id, lc.class_id, lc.teacher_id, lc.subject_id, lc.start_time, lc.end_time,
            s.subject_name
     FROM live_classes lc
     LEFT JOIN subjects s ON lc.subject_id = s.id
     ${whereClause}
     ORDER BY lc.start_time DESC`,
    params
  );
  return rows;
};

export const createLiveClass = async (payload, user) => {
  await ensureClassOwnership(user, payload.classId);
  const teacherId = await resolveTeacherId(
    user,
    payload.teacherUserId,
    payload.teacherId
  );
  const [result] = await pool.query(
    "INSERT INTO live_classes (class_id, teacher_id, subject_id, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
    [payload.classId, teacherId, payload.subjectId, payload.startTime, payload.endTime]
  );
  return { id: result.insertId, class_id: payload.classId };
};

export const updateLiveClass = async (id, payload, user) => {
  const [rows] = await pool.query(
    "SELECT class_id FROM live_classes WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Live class not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  const updates = [];
  const params = [];
  if (payload.subjectId !== undefined) {
    updates.push("subject_id = ?");
    params.push(payload.subjectId);
  }
  if (payload.startTime !== undefined) {
    updates.push("start_time = ?");
    params.push(payload.startTime);
  }
  if (payload.endTime !== undefined) {
    updates.push("end_time = ?");
    params.push(payload.endTime);
  }
  if (updates.length === 0) {
    return { id };
  }
  const [result] = await pool.query(
    `UPDATE live_classes SET ${updates.join(", ")} WHERE id = ?`,
    [...params, id]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Live class not found");
  }
  return { id };
};

export const deleteLiveClass = async (id, user) => {
  const [rows] = await pool.query(
    "SELECT class_id FROM live_classes WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Live class not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  await pool.query("DELETE FROM live_classes WHERE id = ?", [id]);
  return { id };
};

// Recordings
export const listRecordings = async (classId, user) => {
  if (classId) {
    await ensureClassOwnership(user, classId);
  }
  const where = [];
  const params = [];
  if (classId) {
    where.push("class_id = ?");
    params.push(classId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT id, class_id, teacher_id, video_path, created_at
     FROM recordings ${whereClause}
     ORDER BY created_at DESC`,
    params
  );
  return rows;
};

export const createRecording = async (payload, user) => {
  await ensureClassOwnership(user, payload.classId);
  const teacherId = await resolveTeacherId(
    user,
    payload.teacherUserId,
    payload.teacherId
  );
  const [result] = await pool.query(
    "INSERT INTO recordings (class_id, teacher_id, video_path) VALUES (?, ?, ?)",
    [payload.classId, teacherId, payload.videoPath]
  );
  return { id: result.insertId, class_id: payload.classId };
};

export const deleteRecording = async (id, user) => {
  const [rows] = await pool.query(
    "SELECT class_id FROM recordings WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Recording not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  await pool.query("DELETE FROM recordings WHERE id = ?", [id]);
  return { id };
};

// Chat Messages
export const listChatMessages = async (classId) => {
  const [rows] = await pool.query(
    `SELECT cm.id, cm.class_id, cm.sender_id, cm.message, cm.created_at, u.name
     FROM chat_messages cm
     JOIN users u ON cm.sender_id = u.id
     WHERE cm.class_id = ?
     ORDER BY cm.created_at ASC`,
    [classId]
  );
  return rows;
};

export const createChatMessage = async (payload, user) => {
  const [result] = await pool.query(
    "INSERT INTO chat_messages (class_id, sender_id, message) VALUES (?, ?, ?)",
    [payload.classId, user.id, payload.message]
  );
  return { id: result.insertId, class_id: payload.classId };
};

// Exams
export const listExams = async (filters) => {
  const where = [];
  const params = [];
  if (filters.classId) {
    where.push("class_id = ?");
    params.push(filters.classId);
  }
  if (filters.subjectId) {
    where.push("subject_id = ?");
    params.push(filters.subjectId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT id, class_id, subject_id, exam_date
     FROM exams ${whereClause}
     ORDER BY exam_date DESC`,
    params
  );
  return rows;
};

export const createExam = async (payload, user) => {
  await ensureClassOwnership(user, payload.classId);
  const [result] = await pool.query(
    "INSERT INTO exams (class_id, subject_id, exam_date) VALUES (?, ?, ?)",
    [payload.classId, payload.subjectId, payload.examDate]
  );
  return { id: result.insertId, class_id: payload.classId };
};

export const updateExam = async (id, payload, user) => {
  const [rows] = await pool.query("SELECT class_id FROM exams WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) {
    throw new ApiError(404, "Exam not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  const [result] = await pool.query(
    "UPDATE exams SET exam_date = ? WHERE id = ?",
    [payload.examDate, id]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Exam not found");
  }
  return { id };
};

export const deleteExam = async (id, user) => {
  const [rows] = await pool.query("SELECT class_id FROM exams WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) {
    throw new ApiError(404, "Exam not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  await pool.query("DELETE FROM exams WHERE id = ?", [id]);
  return { id };
};

// MCQ Questions
export const listMcqQuestions = async (filters) => {
  const where = [];
  const params = [];
  if (filters.classId) {
    where.push("class_id = ?");
    params.push(filters.classId);
  }
  if (filters.subjectId) {
    where.push("subject_id = ?");
    params.push(filters.subjectId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT id, class_id, subject_id, question_text
     FROM mcq_questions ${whereClause}
     ORDER BY id DESC`,
    params
  );
  return rows;
};

export const createMcqQuestion = async (payload, user) => {
  await ensureClassOwnership(user, payload.classId);
  const [result] = await pool.query(
    "INSERT INTO mcq_questions (class_id, subject_id, question_text) VALUES (?, ?, ?)",
    [payload.classId, payload.subjectId, payload.questionText]
  );
  return { id: result.insertId };
};

export const updateMcqQuestion = async (id, payload, user) => {
  const [rows] = await pool.query(
    "SELECT class_id FROM mcq_questions WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "MCQ question not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  const [result] = await pool.query(
    "UPDATE mcq_questions SET question_text = ? WHERE id = ?",
    [payload.questionText, id]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(404, "MCQ question not found");
  }
  return { id };
};

export const deleteMcqQuestion = async (id, user) => {
  const [rows] = await pool.query(
    "SELECT class_id FROM mcq_questions WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, "MCQ question not found");
  }
  await ensureClassOwnership(user, rows[0].class_id);
  await pool.query("DELETE FROM mcq_questions WHERE id = ?", [id]);
  return { id };
};

// MCQ Options
export const listMcqOptions = async (questionId) => {
  const [rows] = await pool.query(
    "SELECT id, question_id, option_text, is_correct FROM mcq_options WHERE question_id = ?",
    [questionId]
  );
  return rows;
};

export const createMcqOption = async (payload) => {
  const [result] = await pool.query(
    "INSERT INTO mcq_options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
    [payload.questionId, payload.optionText, payload.isCorrect ? 1 : 0]
  );
  return { id: result.insertId };
};

export const updateMcqOption = async (id, payload) => {
  const [result] = await pool.query(
    "UPDATE mcq_options SET option_text = ?, is_correct = ? WHERE id = ?",
    [payload.optionText, payload.isCorrect ? 1 : 0, id]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(404, "MCQ option not found");
  }
  return { id };
};

export const deleteMcqOption = async (id) => {
  const [result] = await pool.query("DELETE FROM mcq_options WHERE id = ?", [
    id,
  ]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, "MCQ option not found");
  }
  return { id };
};

// Exam Results
export const listExamResults = async (filters) => {
  const where = [];
  const params = [];
  if (filters.examId) {
    where.push("er.exam_id = ?");
    params.push(filters.examId);
  }
  if (filters.studentId) {
    where.push("er.student_id = ?");
    params.push(filters.studentId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT er.id, er.exam_id, er.student_id, er.score, er.created_at, u.name
     FROM exam_results er
     JOIN students s ON er.student_id = s.id
     JOIN users u ON s.user_id = u.id
     ${whereClause}
     ORDER BY er.created_at DESC`,
    params
  );
  return rows;
};

export const upsertExamResult = async (payload) => {
  const studentId = await resolveStudentId(
    payload.studentUserId,
    payload.studentId
  );
  await pool.query(
    `INSERT INTO exam_results (exam_id, student_id, score)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE score = VALUES(score)`,
    [payload.examId, studentId, payload.score]
  );
  return { exam_id: payload.examId, student_id: studentId, score: payload.score };
};

export const updateExamResult = async (id, score) => {
  const [result] = await pool.query(
    "UPDATE exam_results SET score = ? WHERE id = ?",
    [score, id]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Exam result not found");
  }
  return { id };
};

export const deleteExamResult = async (id) => {
  const [result] = await pool.query("DELETE FROM exam_results WHERE id = ?", [
    id,
  ]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Exam result not found");
  }
  return { id };
};

// Student Logs
export const listStudentLogs = async (filters) => {
  const where = [];
  const params = [];
  if (filters.studentId) {
    where.push("sl.student_id = ?");
    params.push(filters.studentId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT sl.id, sl.student_id, sl.log_type, sl.description, sl.created_at, u.name
     FROM student_logs sl
     JOIN students s ON sl.student_id = s.id
     JOIN users u ON s.user_id = u.id
     ${whereClause}
     ORDER BY sl.created_at DESC`,
    params
  );
  return rows;
};

export const createStudentLog = async (payload) => {
  const studentId = await resolveStudentId(
    payload.studentUserId,
    payload.studentId
  );
  const [result] = await pool.query(
    "INSERT INTO student_logs (student_id, log_type, description) VALUES (?, ?, ?)",
    [studentId, payload.logType, payload.description]
  );
  return { id: result.insertId, student_id: studentId };
};

export const deleteStudentLog = async (id) => {
  const [result] = await pool.query("DELETE FROM student_logs WHERE id = ?", [
    id,
  ]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, "Student log not found");
  }
  return { id };
};
