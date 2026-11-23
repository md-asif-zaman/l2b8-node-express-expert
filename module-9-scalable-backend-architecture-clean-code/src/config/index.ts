import dotenv from "dotenv";
import path from "path";

// introduce .env file path
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  port: process.env.PORT,
  connection_string: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
};

export default config;
