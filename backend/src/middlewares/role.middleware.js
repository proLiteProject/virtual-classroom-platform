// middlewares/role.middleware.js
import { ROLES, ROLE_HIERARCHY, PERMISSIONS } from '../config/roles.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Check if user has exact role(s)
 * Usage: authorize([ROLES.ADMIN, ROLES.TEACHER])
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const roles = allowedRoles.flat();

      if (!roles.includes(req.user.role)) {
        throw new ApiError(
          403,
          `Access denied. Required roles: ${roles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user has minimum role level
 * Usage: authorizeMinRole(ROLES.TEACHER)
 */
export const authorizeMinRole = (minRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const userRoleLevel = ROLE_HIERARCHY[req.user.role];
      const requiredRoleLevel = ROLE_HIERARCHY[minRole];

      if (userRoleLevel < requiredRoleLevel) {
        throw new ApiError(
          403,
          `Access denied. Minimum role required: ${minRole}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user has specific permission
 */
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const userPermissions = PERMISSIONS[req.user.role];

      if (userPermissions.includes('*') || userPermissions.includes(requiredPermission)) {
        return next();
      }

      throw new ApiError(
        403,
        `Access denied. Required permission: ${requiredPermission}`
      );
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user owns the resource
 */
export const authorizeOwner = (paramName = 'id') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const resourceOwnerId = parseInt(req.params[paramName]);

      // Admin can access any resource
      if (req.user.role === ROLES.ADMIN) {
        return next();
      }

      // Check ownership
      if (req.user.id !== resourceOwnerId) {
        throw new ApiError(403, 'Access denied. You can only access your own resources');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};