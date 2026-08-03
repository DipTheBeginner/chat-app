import http from "http";
import app from "./app";
import { WebSocketServer, WebSocket } from "ws";
import { AuthUser } from "./types/auth";
import jwt from "jsonwebtoken"
import { ClientMessage } from "./types/websocket";
import { joinRoom } from "./webSockets/roomManger";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });



interface AuthenticatedWebSocket extends WebSocket {
  user?: AuthUser
}



wss.on("connection", (ws: AuthenticatedWebSocket, req) => {

  const url = new URL(req.url!, "http://localhost:5000");

  const token = url.searchParams.get("token");

  if (!token) {
    console.log("No token")
    ws.close();
    return;
  }

  try {


    const decoded = jwt.verify(token, "secret") as AuthUser;

    ws.user = decoded;

    console.log("User authenticated", decoded.email);


  } catch (error) {
    console.log("❌ Invalid token");
    ws.close();
    return;


  }
  console.log("new websocket connection");


  ws.on("message", (message) => {
    try {
      const data: ClientMessage = JSON.parse(message.toString());

      console.log(data);

      switch (data.type) {
        case "join-group":
          joinRoom(data.groupId, ws);
          break;

        case "leave-group":
          console.log("Leave group", data.groupId);
          break

        case "send-message":
          console.log(data.content);
          break;
      }
    }catch(error){
      console.log("Invalid websoket message")
    }
  })

})



server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


