// middlewares/auth.middleware.js
import { verifyAccessToken } from '../utils/jwt.util.js';
import { ApiError } from '../utils/ApiError.js';
import pool from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token is required');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = verifyAccessToken(token);

    // 3. Fetch fresh user data from database (SECURITY: check if user still exists)
    const [rows] = await pool.query(
      'SELECT id, email, role, name FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      throw new ApiError(401, 'User not found');
    }

    const user = rows[0];

    // 4. Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    next(error);
  }
};