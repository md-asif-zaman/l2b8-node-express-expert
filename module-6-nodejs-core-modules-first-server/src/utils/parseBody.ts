import type { IncomingMessage } from "http";

// get chunk by chunk data from user and combined them to make a whole data
export const bodyParser = (req: IncomingMessage): Promise<any> => {
  let body = "";

  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};
