import { FindUserById } from "../../../usecases/user/FindUserById";
import { onlineUsers } from "../../../infrastructure/middlewares/socketAuth";
import { Server, Socket } from "socket.io";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

export const inviteHandler = (io: Server, socket: Socket) => {
  socket.on("invite_friend", ({ toUserId }) => {
    const fromUserId = socket.data.userId;
    const toSocketId = onlineUsers.get(toUserId);

    socket.join(fromUserId);

    if (toSocketId) {
      io.to(toSocketId).emit("recieve_invite", { fromUserId });
    }
  });
};

export const joinSlotHandler = (io: Server, socket: Socket) => {
  socket.on("join_slot", async ({ invitedUserId }) => {
    try {
      const joinedUserId = socket.data.userId;
      const roomId = invitedUserId;

      socket.join(roomId);

      const usecase = new FindUserById(new UserRepository());
      const result1 = await usecase.execute({id: invitedUserId});
      const result2 = await usecase.execute({id: joinedUserId});

      if (!result1.user || !result2.user) {
        return socket.emit("room_error", { message: "User not found." });
      }

      io.to(roomId).emit("room_created", {
        slot: [result1.user, result2.user],
        roomId,
      });
    } catch (error) {
      console.error("join_slot error:", error);
      socket.emit("room_error", { message: "Failed to join room." });
    }
  });
};

export const alreadyInRoomHandler = (io: Server, socket: Socket) => {
  socket.on('already_in_room', ({fromUserId}) => {
    const socketId = onlineUsers.get(fromUserId);
    if(socketId) {
      socket.to(socketId).emit('invite_fail', {message: "User is already in a slot."})
    }
  })  
}
