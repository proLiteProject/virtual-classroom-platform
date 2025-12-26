// controllers/classRoom.controller.js
import {
  createClassRoomService,
  getClassRoomsService,
  updateClassRoomService,
  deleteClassRoomService
} from "../services/classRoom.service.js";

export const createClassRoom = async (req, res, next) => {
  try {
    const { classRoom } = req.body;

    if (!classRoom) {
      return res.status(400).json({
        success: false,
        message: "Class Room Name required"
      });
    }

    const result = await createClassRoomService(classRoom, req.user.id);

    res.status(201).json({
      success: true,
      message: "Classroom created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getClassRooms = async (req, res, next) => {
  try {
    const classrooms = await getClassRoomsService(req.user.id, req.user.role);

    res.json({
      success: true,
      data: classrooms
    });
  } catch (error) {
    next(error);
  }
};

export const updateClassRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { classRoom } = req.body;

    if (!classRoom) {
      return res.status(400).json({
        success: false,
        message: "Class Room Name required"
      });
    }

    const result = await updateClassRoomService(id, classRoom, req.user.id, req.user.role);

    res.json({
      success: true,
      message: "Classroom updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClassRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteClassRoomService(id, req.user.id, req.user.role);

    res.json({
      success: true,
      message: "Classroom deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};