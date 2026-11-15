import type { IncomingMessage, ServerResponse } from "http";
import productService from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;
  const urlParams = url?.split("/");
  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

  // GET All Products
  if (url === "/products" && method === "GET") {
    const products = productService();

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Products retrieved successfully",
        data: products,
      }),
    );
  }
  // GET Single Product
  else if (method === "GET" && id !== null) {
    const products = productService();

    const specificProduct = products.find(
      (product: IProduct) => product.id === id,
    );

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Product retrieved successfully",
        data: specificProduct,
      }),
    );
  }
  // POST Create a product
  else if (method === "POST" && url === "/products") {
    const body = await bodyParser(req);
    console.log(body);

    res.writeHead(201, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data: products,
      }),
    );
  }
};

export default productController;
