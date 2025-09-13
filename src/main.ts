import { CLIENT_URL, DATABASE_URL, SERVER } from "./config/config";
import express from "express";
import connectDb from "./infrastructure/db/db";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import {
  bothReadyHandler,
  hitHandler,
  kickHandler,
  leaveHandler,
  playerActionHandler,
  playerPositionUpdate,
  startMatchHandler,
} from "./infrastructure/socket/handlers/matchSocketHandlers";
import {
  alreadyInRoomHandler,
  inviteHandler,
  joinSlotHandler,
} from "./infrastructure/socket/handlers/userSocketHandlers";

import matchRouter from "./infrastructure/routes/matchRoutes";
import userRouter from "./infrastructure/routes/userRoutes";
import authRouter from "./infrastructure/routes/authRoutes";
import {
  onlineUsers,
  socketAuth,
} from "./infrastructure/middlewares/socketAuth";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://cat-vs-cat-client.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

async function main() {
  //middlewares
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({ origin: "https://cat-vs-cat-client.vercel.app", credentials: true })
  );
  io.use(socketAuth);

  //routes
  app.use("/api/match", matchRouter);
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);

  //sockets
  io.on("connection", (socket) => {
    socket.on("join", ({ roomId }) => {
      socket.join(roomId ?? socket.data.userId);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.data.userId);
    });

    inviteHandler(io, socket);
    alreadyInRoomHandler(io, socket);
    joinSlotHandler(io, socket);
    bothReadyHandler(io, socket);
    kickHandler(io, socket);
    leaveHandler(io, socket);

    startMatchHandler(io, socket);
    playerActionHandler(io, socket);
    playerPositionUpdate(io, socket);
    hitHandler(io, socket);
  });

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
