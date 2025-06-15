import { CLIENT_URL, DATABASE_URL, SERVER } from "./config/config.ts";
import express from "express";
import connectDb from "./infrastructure/db/db.ts";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import { bothReadyHandler, kickHandler, leaveHandler, updatePositionHandler } from "./infrastructure/socket/handlers/matchSocketHandlers.ts";
import { alreadyInRoomHandler, inviteHandler, joinSlotHandler } from "./infrastructure/socket/handlers/userSocketHandlers.ts";

import matchRouter from "./infrastructure/routes/matchRoutes.ts";
import userRouter from "./infrastructure/routes/userRoutes.ts";
import authRouter from "./infrastructure/routes/authRoutes.ts";
import { socketAuth } from "./infrastructure/middlewares/socketAuth.ts";

const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: {origin: CLIENT_URL, credentials: true, methods: ['GET', 'POST']}
})


async function main() {

  //middlewares
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({origin: CLIENT_URL, credentials: true}));
  io.use(socketAuth)

  //routes
  app.use("/api/match", matchRouter);
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);

  //sockets
  io.on("connection", (socket) => {
  
    socket.on('join', ({roomId}) => {
      socket.join(roomId?? socket.data.userId);
    });


    inviteHandler(io, socket);
    alreadyInRoomHandler(io, socket);
    joinSlotHandler(io, socket);
    bothReadyHandler(io, socket);
    kickHandler(io, socket);
    leaveHandler(io, socket);
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
