import http, { IncomingMessage, ServerResponse } from "node:http";

const PORT = 5002;

type CreateUserBody = {
  name?: string;
  email?: string;
};

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method ?? "GET";
    const requestUrl = new URL(req.url ?? "/", `http:${req.headers.host}`);
    const pathName = requestUrl.pathname;
    res.setHeader("Content-Type", "text/plain");

    if (method === "POST" && pathName === "/users") {
      const chunks: Buffer[] = [];

      // data event is going to run every time node receives a new body chunk
      req.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on("end", () => {
        try {
          const rawBody = Buffer.concat(chunks).toString("utf-8");

          if (!rawBody) {
            res.statusCode = 400;
            res.end("req body is required");
            return;
          }

          const body = JSON.parse(rawBody) as CreateUserBody;

          if (!body.name || !body.email) {
            res.statusCode = 400;
            res.end("both name and email is required");
            return;
          }

          res.statusCode = 201;
          res.end(`User created ${body.name} and ${body.email}`);
        } catch {
          res.statusCode = 400;
          res.end("invalid json body");
        }
      });

      req.on("error", () => {
        res.statusCode = 500;
        res.end("failed to read request body");
      });
      return;
    }

    res.statusCode = 404;
    res.end("route not found");
  },
);

server.listen(PORT, () => {
  console.log(`server is now running on port ${PORT}`);
});
