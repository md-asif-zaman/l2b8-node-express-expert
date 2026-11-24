import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfileIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "profile not found",
      error,
    });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await profileService.getSingleProfileFromDB(id as string);

    if (result.rowCount === 0) {
      res.status(500).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Can not found Profile",
      error,
    });
  }
};

export const ProfileController = {
  createProfile,
  getUserProfile,
};
