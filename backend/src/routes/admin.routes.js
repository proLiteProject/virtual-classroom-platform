// routes/admin.routes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { ROLES } from '../config/roles.js';
import { countForTableController, manageRoleDataFetchController, userDataController, deleteUserController } from '../controllers/admin.controller.js';

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

router.get('/manage-role',manageRoleDataFetchController);

router.put('/update-user', userDataController);
router.patch('/update-user', userDataController);

router.delete('/delete-user/:id', deleteUserController);
router.delete('/delete-user', deleteUserController);

export default router;
