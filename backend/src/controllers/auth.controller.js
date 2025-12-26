// controllers/auth.controller.js
import { loginService, getProfileService } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const result = await loginService(email, password);

    res.json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await getProfileService(req.user.id);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};