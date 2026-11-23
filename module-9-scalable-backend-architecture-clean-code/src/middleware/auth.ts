import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // Check if the token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token not found.",
      });
    }
    //Decode Access Token
    const decode = jwt.verify(token as string, config.jwt_secret) as JwtPayload;

    //Check that user is exists or not in database
    const user = await pool.query(
      `
        SELECT * FROM users WHERE email = $1
    `,
      [decode.email],
    );

    if (user.rowCount === 0) {
      res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }
    // Check user is active or not
    if (!user.rows[0].is_active) {
      res.status(403).json({
        success: false,
        message: "User is not active.",
      });
    }
    // inject decoded user inside req
    req.user = decode;
    next();
  };
};

export default auth;
