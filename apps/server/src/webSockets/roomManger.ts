import WebSocket from "ws";
import { AuthUser } from "../types/auth";





export interface AuthenticatedWebSocket extends WebSocket {
    user?: AuthUser;
}


const rooms = new Map<string, Set<AuthenticatedWebSocket>>();


export function joinRoom(groupId: string, ws: AuthenticatedWebSocket) {
    if (!rooms.has(groupId)) {
        rooms.set(groupId, new Set());
    }


    rooms.get(groupId)!.add(ws);
    console.log(`User joined room ${groupId}`)

}


export function leaveRoom(groupId: string, ws: AuthenticatedWebSocket) {
    rooms.get(groupId)?.delete(ws);

    if (rooms.get(groupId)?.size === 0) {
        rooms.delete(groupId)
    }
}

export function broadcast(groupId: string, data: string) {
    const clients = rooms.get(groupId);

    console.log("Broadcast() called");
    console.log("Room:", groupId);
    console.log("Clients:", clients?.size);

    if (!clients) {
        console.log("No clients found");
        return;
    }

    for (const client of clients) {
        console.log(
            "Client:",
            client.user?.email,
            "ReadyState:",
            client.readyState
        );

        if (client.readyState === WebSocket.OPEN) {
            console.log("Sending message");
            client.send(data);
        }
    }
}





