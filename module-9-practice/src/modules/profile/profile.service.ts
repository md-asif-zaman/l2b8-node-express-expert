import { pool } from "../../db";
import type { IProfile } from "./profile.interface";

const createProfileIntoDB = async (payload: IProfile) => {
  const { user_id, address, bio, gender, phone } = payload;

  // Check user existance in database and show error if not found
  const user = await pool.query(
    `
        SELECT * from users_practice WHERE id = $1
    `,
    [user_id],
  );

  if (user.rowCount === 0) {
    throw new Error("User not exists is database");
  }

  // create a profile in database
  const result = await pool.query(
    `
        INSERT INTO profile_practice(user_id, bio, address, phone, gender) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [user_id, bio, address, phone, gender],
  );

  return result;
};

const getSingleProfileFromDB = async (id: string) => {
  const result = await pool.query(
    `SELECT * from profile_practice WHERE id = $1`,
    [id],
  );
  return result;
};

export const profileService = {
  createProfileIntoDB,
  getSingleProfileFromDB,
};
