// services/auth.service.js
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util.js";
import { ApiError } from "../utils/ApiError.js";

export const loginService = async (email, password) => {
  // 1. Get user
  const [rows] = await pool.query(
    "SELECT id, name, email, password, role FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new ApiError(401, "Invalid email or password");
  }

  const user = rows[0];

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Create JWT tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ userId: user.id });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

export const getProfileService = async (userId) => {
  const [users] = await pool.query(
    'SELECT id, email, name, role FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  return users[0];
};