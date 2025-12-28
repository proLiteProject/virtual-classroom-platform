import { getCountForTable } from "../services/admin.service.js";

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