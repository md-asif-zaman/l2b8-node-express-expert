import { createServer } from "http";

const server = createServer((req, res) => {});

server.listen(5000, () => {
  console.log("Server is running successfully");
});
