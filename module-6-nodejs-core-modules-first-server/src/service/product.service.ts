import { readFileSync } from "fs";
import path from "path";

const productService = () => {
  const filePath = path.join(process.cwd(), "./src/database/db.json");

  const result = readFileSync(filePath, "utf-8");

  return JSON.parse(result);
};

export default productService;
