import { CLIENT_URL, DATABASE_URL, SERVER } from "./config/config.ts";
import express from "express";
import connectDb from "./infrastructure/db/db.ts";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { updatePositionHandler } from "./infrastructure/socket/handlers/matchSocketHandlers.ts";

import matchRouter from "./infrastructure/routes/matchRoutes.ts";
import userRouter from "./infrastructure/routes/userRoutes.ts";
import authRouter from "./infrastructure/routes/authRoutes.ts";

const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: {origin: CLIENT_URL, credentials: true}
})


async function main() {

  //middlewares
  app.use(express.json());
  app.use(cors({origin: CLIENT_URL, credentials: true}));

  //routes
  app.use("/api/match", matchRouter);
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);

  //sockets
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
