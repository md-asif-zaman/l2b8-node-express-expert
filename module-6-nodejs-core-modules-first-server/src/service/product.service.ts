import path from "path";

const productService = () => {
  const filePath = path.join(process.cwd(), "./src/database/db.json");
  console.log(filePath);
};

export default productService;
