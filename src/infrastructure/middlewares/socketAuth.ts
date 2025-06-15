import { verifyAccessToken } from "../../lib/util/token";
import { Socket } from "socket.io";


export const onlineUsers = new Map<string, string>();

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("No token provided"));
    }
    try {
        const decoded = verifyAccessToken(token);
        socket.data.userId = (decoded as any)._id;
        onlineUsers.set((decoded as any)._id, socket.id)
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
};