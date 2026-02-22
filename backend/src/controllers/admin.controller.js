import { getCountForTable, manageRoleDataFetchService, updateUserData, deleteUser } from "../services/admin.service.js";
import { ApiError } from "../utils/ApiError.js";

export const countForTableController = async (req, res, next) => {
  try {
    
    const result = await getCountForTable();

    res.json({
      success: true,
      message: "Got the Count of the data",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const manageRoleDataFetchController = async (req, res, next) => {
  try{
    const result = await manageRoleDataFetchService();

    res.json({
      success: true,
      message: "user data obtained",
      data: result
    });
  }catch(error){
    next(error);
  }

}

export const userDataController = async(req, res, next) => {
  try{
    const {
      userId,
      role,
      qualification,
      phone,
      roll_no,
      name,
      email
    } = req.body || {};

    if (!userId) {
      throw new ApiError(400, "userId is required");
    }

    const result = await updateUserData({
      userId,
      role,
      qualification,
      phone,
      roll_no,
      name,
      email
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: result
    });
  }
  catch(error){
    next(error);
  }
}

export const deleteUserController = async(req, res, next) => {
  try{
    const userId = req.params?.id || req.query?.id || req.body?.userId;

    if (!userId) {
      throw new ApiError(400, "userId is required");
    }

    const result = await deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
      data: result
    });
  }
  catch(error){
    next(error);
  }
}
