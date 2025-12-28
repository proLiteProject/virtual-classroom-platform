
import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export const getCountForTable = async (className, teacherId) => {
  const [teacherCount] = await pool.query(
    `SELECT COUNT(*) as teacher_count FROM teachers;`
  );
  const [studentCount] = await pool.query(
    `SELECT COUNT(*) as student_count FROM students;`
  );
  const [classRoomCount] = await pool.query(
    `SELECT COUNT(*) as class_count FROM classes;`
  );

  return {
    teacherCount : teacherCount[0].teacher_count,
    classCount : classRoomCount[0].class_count,
    studentCount : studentCount[0].student_count
  };
};