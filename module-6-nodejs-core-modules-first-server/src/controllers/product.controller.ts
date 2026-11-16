import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  // get product id from url: http://localhost:5000/products/1
  const urlParams = url?.split("/");
  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

  //* Get All Product
  if (url === "/products" && method === "GET") {
    try {
      // get products from service page
      const products = productService();
      sendResponse(res, true, 200, "Products retrived successfully!", products);
    } catch (error) {
      sendResponse(res, false, 500, "Internal server error");
    }
  }
  //* Get Single product
  else if (method === "GET" && id !== null) {
    try {
      const products = productService();
      const product = products.find((p: IProduct) => p.id === id);

      if (!product) {
        return sendResponse(res, false, 404, "Product not found!");
      }
      sendResponse(res, true, 200, "Product retrived successfully!", product);
    } catch (error) {
      sendResponse(res, false, 500, "Internal server error");
    }
  }
  //* POST a product
  else if (method === "POST" && url === "/products") {
    // parse data manually using bodyParser
    const body = await bodyParser(req);
    const newProduct = {
      id: Date.now(),
      ...body,
    };

    const products = productService();
    products.push(newProduct);
    createProduct(products);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully!",
        data: newProduct,
      }),
    );
  }
  //* Update a product
  else if (method === "PUT" && id !== null) {
    const body = await bodyParser(req);
    const products = productService();

    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product Not Found!",
        }),
      );
    }
    products[index] = { id: products[index].id, ...body };

    createProduct(products);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product updated successfully!",
        data: products[index],
      }),
    );
  }
  //* DELETE a product
  else if (method === "DELETE" && id !== null) {
    const products = productService(); // [{},{}]
    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product Not Found!",
        }),
      );
    }

    products.splice(index, 1);

    createProduct(products);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product deleted successfully!",
      }),
    );
  }
};

export default productController;
