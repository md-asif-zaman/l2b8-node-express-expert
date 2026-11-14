import type { IncomingMessage, ServerResponse } from "http";
import productController from "../controllers/product.controller";

const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  // root url
  if (url === "/" && method === "GET") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(JSON.stringify({ message: "This is root route" }));
  }
  // products route
  else if (url?.startsWith("/products")) {
    productController(req, res);
  }
  // not round route
  else {
    res.writeHead(404, {
      "Content-type": "application/json",
    });
    res.end(JSON.stringify({ message: "Route is not found" }));
  }
};

export default routeHandler;
