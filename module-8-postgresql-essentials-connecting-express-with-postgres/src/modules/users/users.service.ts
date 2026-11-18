import { pool } from "../../db";
import type { IUser } from "./users.interface";

const createUserIntDB = async (payload: IUser) => {
  const { name, email, password, age } = payload;

  const result = await pool.query(
    ` INSERT INTO users(name, email, password, age)  VALUES($1, $2, $3, $4) RETURNING *`,
    [name, email, password, age],
  );

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * from users`);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * from users WHERE id = $1`, [id]);
  return result;
};

const updateUserToDB = async (id: string, payload: IUser) => {
  const { name, password, age, is_Active } = payload;

  const result = await pool.query(
    `
      UPDATE users
      SET 
      name = COALESCE($1, name),
      password = COALESCE($2, password),
      age = COALESCE($3, age),
      is_Active = COALESCE($4, is_Active),
      updated_at = NOW()
      WHERE id = $5 RETURNING *
      `,
    // if name do not come from user then set name == null. So COALESCE do not accept new name and remain old name in database
    [name ?? null, password ?? null, age ?? null, is_Active ?? null, id],
  );

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    `,
    [id],
  );

  return result;
};

export const userService = {
  createUserIntDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserToDB,
  deleteUserFromDB,
};
