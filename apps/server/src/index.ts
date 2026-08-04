import http from "http";
import app from "./app";
import { WebSocketServer, WebSocket } from "ws";
import { AuthUser } from "./types/auth";
import jwt from "jsonwebtoken"
import groupHandler from "./webSockets/groupHandler";
import { AuthenticatedWebSocket } from "./webSockets/roomManger";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });


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
    console.log("Invalid token");
    ws.close();
    return;


  }
  console.log("new websocket connection");


  ws.on("message", async (message) => {
    await groupHandler(ws, message);
  });

  ws.on("close", () => {
    console.log(`${ws.user?.email} disconnected`);
  });

});



server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


