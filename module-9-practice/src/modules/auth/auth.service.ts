import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: IAuth) => {
  const { email, password } = payload;

  const user = await pool.query(
    `
    SELECT * from users_practice where email = $1
        `,
    [email],
  );

  //   console.log(user);

  if (user.rowCount == 0) {
    throw new Error("User not found");
  }

  if (user.rows[0].is_active === false) {
    throw new Error("User is blocked");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.rows[0].password,
  );
  if (!isPasswordMatched) {
    throw new Error("Password isn't matched");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: "10d",
    },
  );

  return { accessToken, refreshToken };
};

const createRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized User");
  }

  const decode = jwt.verify(
    token as string,
    config.jwt_refresh_secret,
  ) as JwtPayload;
  const user = await pool.query(
    `
    SELECT * from users_practice where email = $1
        `,
    [decode.email],
  );

  //   console.log(user);

  if (user.rowCount == 0) {
    throw new Error("User not found");
  }

  if (user.rows[0].is_active === false) {
    throw new Error("User is blocked");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUser,
  createRefreshToken,
};
