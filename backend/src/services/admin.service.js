
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

export const manageRoleDataFetchService = async () => {
  const [userData] = await pool.query(
    `SELECT
        *
      FROM
        users u
      LEFT JOIN teachers t 
          ON
        t.user_id = u.id
        AND u.role IN ('ADMIN', 'TEACHER')
      LEFT JOIN students s 
          ON
        s.user_id = u.id
        AND u.role = 'STUDENT';`
  );

  return {
    userData : userData
  };
};