import { AuthenticatedWebSocket } from "./roomManger";



const onlineUser = new Map<string, AuthenticatedWebSocket>();



export function addOnlineUser(ws: AuthenticatedWebSocket) {


    const userId = ws.user!.id;

    onlineUser.set(userId, ws);

    console.log("✅ ADD ONLINE USER:", userId);




    console.log(`User ${userId} is online`)



}


export function removeOnlineUser(ws: AuthenticatedWebSocket) {
    const userId = ws.user!.id;


    const currentSocket = onlineUser.get(userId)

    if (currentSocket === ws) {
        onlineUser.delete(userId)
    }

    console.log(`User ${userId} is offline`);
}


export function getOnlineUser(userId: string) {
    const socket = onlineUser.get(userId);

    console.log("Looking for receiver:", userId);
    console.log("Current online users:", [...onlineUser.keys()]);

    if (!socket) {
        console.log("❌ Receiver socket NOT found");
        return null;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        console.log("❌ Receiver socket exists but is not OPEN");
        onlineUser.delete(userId);


        return null;
    }

    return socket;
}

