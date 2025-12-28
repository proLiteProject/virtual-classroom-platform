// routes/admin.routes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { ROLES } from '../config/roles.js';
import { countForTableController } from '../controllers/admin.controller.js';

const router = express.Router();

// All routes require ADMIN role
router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

// Example admin routes
router.get('/users', (req, res) => {
  res.json({ message: 'Get all users - Admin only' });
});

router.delete('/users/:id', (req, res) => {
  res.json({ message: 'Delete user - Admin only' });
});

router.get('/table-data-count',countForTableController);

export default router;