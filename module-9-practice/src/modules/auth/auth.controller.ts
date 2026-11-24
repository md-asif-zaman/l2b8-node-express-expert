import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
      accessToken: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "profile not found",
      error,
    });
  }
};

export const AuthController = {
  loginUser,
};
