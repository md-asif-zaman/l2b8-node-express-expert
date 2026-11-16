import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { IProduct } from "../types/product";

// get file path of db.json
const filePath = path.join(process.cwd(), "./src/database/db.json");

// read file from db.json and send response
export const productService = () => {
  const result = readFileSync(filePath, "utf-8");

  return JSON.parse(result);
};

// write file to db.json
export const createProduct = (payload: IProduct[]) => {
  writeFileSync(filePath, JSON.stringify(payload));
};
