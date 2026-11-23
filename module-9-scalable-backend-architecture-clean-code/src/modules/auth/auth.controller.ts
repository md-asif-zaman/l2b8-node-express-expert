import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: false, // http --> false, https --> true
      httpOnly: true, //Prevent XSS Attack
      sameSite: "lax", // "node", "strict", "lax" --> CSRF
      // maxAge,
      path: "/",
      domain: "localhost",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully.",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      error,
    });
  }
};

// Generate Access token from refresh token
const generateToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateAccessToken(
      req.cookies.refreshToken,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Access Token generated successfully.",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      error,
    });
  }
};

export const authController = {
  loginUser,
  generateToken,
};
