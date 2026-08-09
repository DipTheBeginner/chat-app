import { AuthenticatedWebSocket } from "./roomManger";





const onlineUser=new Map <string , AuthenticatedWebSocket>();



export function addOnlineUser(ws:AuthenticatedWebSocket){


    const userId= ws.user!.id;

    onlineUser.set(userId, ws);

    console.log(`User ${userId} is online`)
    


}


export function removeOnlineUser(ws : AuthenticatedWebSocket){
    const userId = ws.user!.id;


    const currentSocket =onlineUser.get(userId)

    if(currentSocket === ws){
        onlineUser.delete(userId)
    }

    console.log(`User ${userId} is offline`);
}


export function getOnlineUser(userId:string){
    const socket = onlineUser.get(userId);

    if(!socket){
        return null;
    }

    if(socket.readyState ! == WebSocket.OPEN){
        onlineUser.delete(userId);

        return null;
    }

    return socket;
}

