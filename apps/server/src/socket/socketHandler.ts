import type { Socket } from "socket.io";
import registerGroupSocket from "./groupSocket";

export default function registerSocketHandlers(socket: Socket) {
    registerGroupSocket(socket);
}