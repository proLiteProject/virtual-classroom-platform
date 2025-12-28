// routes/class.routes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize, authorizeMinRole, checkPermission } from '../middlewares/role.middleware.js';
import { ROLES } from '../config/roles.js';
import {
  createClassRoom,
  getClassRooms,
  updateClassRoom,
  deleteClassRoom
} from '../controllers/classRoom.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get classrooms (all roles)
router.get('/', getClassRooms);

// Create classroom (Teacher and Admin only)
router.post('/', authorizeMinRole(ROLES.TEACHER), createClassRoom);

// Update classroom (Teacher and Admin only)
router.put('/:id', authorizeMinRole(ROLES.TEACHER), updateClassRoom);

// Delete classroom (Teacher and Admin only)
router.delete('/:id', authorizeMinRole(ROLES.TEACHER), deleteClassRoom);

export default router;