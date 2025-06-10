import { DATABASE_URL, SERVER } from "./config/config.ts";
import express from "express";
import connectDb from "./infrastructure/db/db.ts";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { updatePositionHandler } from "./infrastructure/socket/handlers/matchSocketHandlers.ts";

import matchRouter from "./infrastructure/routes/matchRoutes.ts";

const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: {origin: "*"}
})


async function main() {

  app.use(cors({origin: "*"}));
  app.use("/api/match", matchRouter);

  io.on("connection", (socket) => {
    updatePositionHandler(socket);
  })

  connectDb(DATABASE_URL).then(() => {
    httpServer.listen(SERVER.SERVER_PORT, () => {
      console.log(
        "Server is listen on",
        SERVER.SERVER_HOSTNAME,
        SERVER.SERVER_PORT
      );
    });
  });
}

main();
