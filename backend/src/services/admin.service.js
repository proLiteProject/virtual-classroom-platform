
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
        u.id AS user_id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        t.id AS teacher_id,
        t.qualification,
        t.phone AS teacher_phone,
        s.id AS student_id,
        s.roll_no,
        s.phone AS student_phone
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

export const updateUserData = async (payload) => {
 
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT id, role FROM users WHERE id = ?`,
      [payload.userId]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "User not found");
    }

    const currentRole = rows[0].role;
    const nextRole = payload.role || currentRole;
    const validRoles = ["ADMIN", "TEACHER", "STUDENT"];

    if (!validRoles.includes(nextRole)) {
      throw new ApiError(400, "Invalid role");
    }

    const userUpdates = [];
    const userParams = [];
    if (payload.role) {
      userUpdates.push("role = ?");
      userParams.push(nextRole);
    }
    if (payload.name) {
      userUpdates.push("name = ?");
      userParams.push(payload.name);
    }
    if (payload.email) {
      userUpdates.push("email = ?");
      userParams.push(payload.email);
    }

    if (userUpdates.length > 0) {
      await connection.query(
        `UPDATE users SET ${userUpdates.join(", ")} WHERE id = ?`,
        [...userParams, payload.userId]
      );
    }

    if (nextRole === "STUDENT") {
      await connection.query(`DELETE FROM teachers WHERE user_id = ?`, [
        payload.userId,
      ]);

      const [studentRows] = await connection.query(
        `SELECT id FROM students WHERE user_id = ?`,
        [payload.userId]
      );

      if (studentRows.length > 0) {
        const studentUpdates = [];
        const studentParams = [];
        if (payload.roll_no !== undefined) {
          studentUpdates.push("roll_no = ?");
          studentParams.push(payload.roll_no);
        }
        if (payload.phone !== undefined) {
          studentUpdates.push("phone = ?");
          studentParams.push(payload.phone);
        }

        if (studentUpdates.length > 0) {
          await connection.query(
            `UPDATE students SET ${studentUpdates.join(", ")} WHERE user_id = ?`,
            [...studentParams, payload.userId]
          );
        }
      } else {
        await connection.query(
          `INSERT INTO students (user_id, roll_no, phone) VALUES (?, ?, ?)`,
          [
            payload.userId,
            payload.roll_no ?? null,
            payload.phone ?? null,
          ]
        );
      }
    } else {
      await connection.query(`DELETE FROM students WHERE user_id = ?`, [
        payload.userId,
      ]);

      const [teacherRows] = await connection.query(
        `SELECT id FROM teachers WHERE user_id = ?`,
        [payload.userId]
      );

      if (teacherRows.length > 0) {
        const teacherUpdates = [];
        const teacherParams = [];
        if (payload.qualification !== undefined) {
          teacherUpdates.push("qualification = ?");
          teacherParams.push(payload.qualification);
        }
        if (payload.phone !== undefined) {
          teacherUpdates.push("phone = ?");
          teacherParams.push(payload.phone);
        }

        if (teacherUpdates.length > 0) {
          await connection.query(
            `UPDATE teachers SET ${teacherUpdates.join(", ")} WHERE user_id = ?`,
            [...teacherParams, payload.userId]
          );
        }
      } else {
        await connection.query(
          `INSERT INTO teachers (user_id, qualification, phone) VALUES (?, ?, ?)`,
          [
            payload.userId,
            payload.qualification ?? null,
            payload.phone ?? null,
          ]
        );
      }
    }

    await connection.commit();

    return {
      userId: payload.userId,
      role: nextRole,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteUser = async (userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT id FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "User not found");
    }

    await connection.query(`DELETE FROM users WHERE id = ?`, [userId]);

    await connection.commit();

    return { userId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
