import {
  listStudentClasses,
  listStudentClassSubjects,
  listStudentMaterials,
  markMaterialRead
} from "../services/student.service.js";
import { ApiError } from "../utils/ApiError.js";

export const getStudentClassesController = async (req, res, next) => {
  try {
    const data = await listStudentClasses(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStudentClassSubjectsController = async (req, res, next) => {
  try {
    const classId = req.query.class_id;
    if (!classId) throw new ApiError(400, "class_id is required");
    const data = await listStudentClassSubjects(req.user.id, classId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStudentMaterialsController = async (req, res, next) => {
  try {
    const classId = req.query.class_id;
    const subjectId = req.query.subject_id;
    if (!classId || !subjectId) {
      throw new ApiError(400, "class_id and subject_id are required");
    }
    const data = await listStudentMaterials(req.user.id, classId, subjectId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markStudentMaterialReadController = async (req, res, next) => {
  try {
    const data = await markMaterialRead(req.user.id, req.params.id);
    res.json({ success: true, message: "Marked as read", data });
  } catch (error) {
    next(error);
  }
};
