// config/roles.js
export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
};

export const ROLE_HIERARCHY = {
  [ROLES.STUDENT]: 1,
  [ROLES.TEACHER]: 2,
  [ROLES.ADMIN]: 3
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.TEACHER]: [
    'classroom:create',
    'classroom:update',
    'classroom:delete',
    'classroom:view',
    'assignment:create',
    'assignment:grade'
  ],
  [ROLES.STUDENT]: [
    'classroom:view',
    'assignment:submit',
    'assignment:view'
  ]
};