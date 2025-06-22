import { Server, Socket } from "socket.io";
import { MatchRepository } from "../../../infrastructure/repositories/MatchRepository.ts";
import { onlineUsers } from "../../../infrastructure/middlewares/socketAuth.ts";
import { FindUserById } from "../../../usecases/user/FindUserById.ts";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository.ts";
import { StartMatch } from "../../../usecases/match/StartMatch.ts";
import { PlayerData, PlayerInput } from "../../../infrastructure/type/Match.ts";

export const hitHandler = (io: Server, socket: Socket) => {
  socket.on('hit', ({remoteId, updateHealth}) => {
    const socketId = onlineUsers.get(remoteId);
    
    if (socketId) {
      io.to(socketId).emit("got_hit", { updateHealth });
    }
  })
}

export const playerPositionUpdate = (io: Server, socket: Socket) => {
  socket.on("update_position", ({ remoteId, position }) => {
    const socketId = onlineUsers.get(remoteId);

    if (socketId) {
      io.to(socketId).emit("position_updated", { position });
    }
  });
};

export const playerActionHandler = (io: Server, socket: Socket) => {
  socket.on("player_action", (data: { userId: string; input: PlayerInput }) => {
    const socketId = onlineUsers.get(data.userId);

    if (socketId) {
      io.to(socketId).emit("player_acted", { input: data.input });
    }
  });
};

export const bothReadyHandler = (io: Server, socket: Socket) => {
  socket.on("ready", ({ hostUserId, isReady }) => {
    const roomId = hostUserId;

    io.to(roomId).emit("both_ready", { isReady: !isReady });
  });
};

export const leaveHandler = (io: Server, socket: Socket) => {
  socket.on("leave", async ({ hostUserId }) => {
    try {
      const usecase = new FindUserById(new UserRepository());
      const result = await usecase.execute({ id: hostUserId });
      const socketId = onlineUsers.get(hostUserId);

      socket.leave(hostUserId);

      if (socketId) {
        io.to(socketId).emit("player_left", { user: result.user });
      }
    } catch (err) {
      socket.emit("leave_error", { message: "Failed to kict player" });
    }
  });
};

export const kickHandler = (io: Server, socket: Socket) => {
  socket.on("kick", async ({ kickedId }) => {
    try {
      const usecase = new FindUserById(new UserRepository());
      const result = await usecase.execute({ id: kickedId });
      const socketId = onlineUsers.get(kickedId);

      if (socketId) {
        const targetSocket = io.sockets.sockets.get(socketId);
        targetSocket?.leave(socket.data.userId);
        io.to(socketId).emit("kicked", { user: result.user });
      }
    } catch (err) {
      console.error("join_slot error:", err);
      socket.emit("kick_error", { message: "Failed to kict player" });
    }
  });
};

export const startMatchHandler = (io: Server, socket: Socket) => {
  socket.on("match_start", async ({ p1, p2 }) => {
    try {
      const usecase = new StartMatch(new MatchRepository());
      const result = await usecase.execute({ p1, p2 });
      const match = result.match;

      if (!match) throw new Error("Cann't create a match");

      const socketId1 = onlineUsers.get(p1);
      const socket1 = socketId1 ? io.sockets.sockets.get(socketId1) : undefined;

      const socketId2 = onlineUsers.get(p2);
      const socket2 = socketId2 ? io.sockets.sockets.get(socketId2) : undefined;

      if (!socket1 || !socket2) throw new Error("One of the player is offine");

      socket1.join(match.id);
      socket2.join(match.id);

      io.to(match.id).emit("match_started", { matchId: match.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      socket.emit("match_start_error", { message: errorMessage });
    }
  });
};
