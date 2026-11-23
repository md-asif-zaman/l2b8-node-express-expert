import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  // if pass all then generate jwt token

  const { email, password } = payload;

  // Check if user exists
  const user = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  if (user.rowCount === 0) {
    throw new Error("Invalid Credentials");
  }

  // Check if password matched
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // Check user status
  if (user.rows[0].is_active === false) {
    throw new Error("Access denied!");
  }

  // Create JWT Access Token
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
    expiresIn: "10d",
  });

  delete user.rows[0].password;

  return { accessToken, refreshToken, user: user.rows[0] };
};

// generate Access Token from refresh Token
const generateAccessToken = async (token: string) => {
  // Check if the token exists
  if (!token) {
    throw new Error("Unauthorized User");
  }
  //Decode Access Token
  const decode = jwt.verify(
    token as string,
    config.jwt_refresh_secret,
  ) as JwtPayload;

  //Check that user is exists or not in database
  const user = await pool.query(
    `
        SELECT * FROM users WHERE email = $1
    `,
    [decode.email],
  );

  if (user.rowCount === 0) {
    throw new Error("User not found.");
  }
  // Check user is active or not
  if (!user.rows[0].is_active) {
    throw new Error("User is not active");
  }

  // Create JWT Access Token
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateAccessToken,
};
