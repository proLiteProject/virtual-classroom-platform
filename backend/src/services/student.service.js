import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

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

const ensureEnrollment = async (classId, studentId) => {
  const [rows] = await pool.query(
    "SELECT id FROM class_students WHERE class_id = ? AND student_id = ?",
    [classId, studentId]
  );
  if (rows.length === 0) {
    throw new ApiError(403, "You are not enrolled in this class");
  }
};

export const listStudentClasses = async (userId) => {
  const studentId = await getStudentIdForUser(userId);
  const [rows] = await pool.query(
    `SELECT c.id, c.class_name, c.created_at, c.teacher_id
     FROM classes c
     JOIN class_students cs ON cs.class_id = c.id
     WHERE cs.student_id = ?
     ORDER BY c.created_at DESC`,
    [studentId]
  );
  return rows;
};

export const listStudentClassSubjects = async (userId, classId) => {
  const studentId = await getStudentIdForUser(userId);
  await ensureEnrollment(classId, studentId);
  const [rows] = await pool.query(
    `SELECT cs.id, cs.class_id, cs.subject_id, s.subject_name
     FROM class_subjects cs
     JOIN subjects s ON cs.subject_id = s.id
     WHERE cs.class_id = ?`,
    [classId]
  );
  return rows;
};

export const listStudentMaterials = async (userId, classId, subjectId) => {
  const studentId = await getStudentIdForUser(userId);
  await ensureEnrollment(classId, studentId);
  const [rows] = await pool.query(
    `SELECT m.id, m.title, m.file_path, m.created_at,
            mcm.class_id, mcm.subject_id
     FROM materials m
     JOIN material_class_map mcm ON m.id = mcm.material_id
     WHERE mcm.class_id = ? AND mcm.subject_id = ?
     ORDER BY m.created_at DESC`,
    [classId, subjectId]
  );
  return rows;
};

export const markMaterialRead = async (userId, materialId) => {
  const studentId = await getStudentIdForUser(userId);
  await pool.query(
    "INSERT IGNORE INTO material_read_log (material_id, student_id, status) VALUES (?, ?, 'READ')",
    [materialId, studentId]
  );
  return { material_id: materialId, student_id: studentId };
};
