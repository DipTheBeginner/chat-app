import { AuthenticatedWebSocket } from "./roomManger";





const onlineUser=new Map <string , AuthenticatedWebSocket>();



export function addOnlineUser(ws:AuthenticatedWebSocket){
    const userId= ws.user!.id;


    
}