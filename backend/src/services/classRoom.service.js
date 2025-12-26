// services/classRoom.service.js
import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export const createClassRoomService = async (className, teacherId) => {
  const [result] = await pool.query(
    `INSERT INTO classes (class_name, teacher_id, created_at, updated_at)
     VALUES (?, ?, NOW(), NOW())`,
    [className, teacherId]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(500, "Failed to create classroom");
  }

  return {
    id: result.insertId,
    class_name: className
  };
};

export const getClassRoomsService = async (userId, userRole) => {
  let query;
  let params;

  if (userRole === 'ADMIN') {
    // Admin sees all classrooms
    query = 'SELECT * FROM classes ORDER BY created_at DESC';
    params = [];
  } else if (userRole === 'TEACHER') {
    // Teacher sees their own classrooms
    query = 'SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at DESC';
    params = [userId];
  } else {
    // Student sees enrolled classrooms
    query = `
      SELECT c.* FROM classes c
      INNER JOIN enrollments e ON c.id = e.class_id
      WHERE e.student_id = ?
      ORDER BY c.created_at DESC
    `;
    params = [userId];
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const updateClassRoomService = async (classId, className, userId, userRole) => {
  // Check ownership (only teacher who created it or admin can update)
  if (userRole !== 'ADMIN') {
    const [classRows] = await pool.query(
      'SELECT teacher_id FROM classes WHERE id = ?',
      [classId]
    );

    if (classRows.length === 0) {
      throw new ApiError(404, 'Classroom not found');
    }

    if (classRows[0].teacher_id !== userId) {
      throw new ApiError(403, 'You can only update your own classrooms');
    }
  }

  const [result] = await pool.query(
    'UPDATE classes SET class_name = ?, updated_at = NOW() WHERE id = ?',
    [className, classId]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Classroom not found');
  }

  return { id: classId, class_name: className };
};

export const deleteClassRoomService = async (classId, userId, userRole) => {
  // Check ownership
  if (userRole !== 'ADMIN') {
    const [classRows] = await pool.query(
      'SELECT teacher_id FROM classes WHERE id = ?',
      [classId]
    );

    if (classRows.length === 0) {
      throw new ApiError(404, 'Classroom not found');
    }

    if (classRows[0].teacher_id !== userId) {
      throw new ApiError(403, 'You can only delete your own classrooms');
    }
  }

  const [result] = await pool.query('DELETE FROM classes WHERE id = ?', [classId]);

  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Classroom not found');
  }

  return { message: 'Classroom deleted successfully' };
};