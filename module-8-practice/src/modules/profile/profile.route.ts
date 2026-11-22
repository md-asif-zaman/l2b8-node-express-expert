import { Router } from "express";
import { ProfileController } from "./profile.controller";

const router = Router();

router.post("/", ProfileController.createProfile);
router.get("/:id", ProfileController.getUserProfile);

export const profileRouter = router;
