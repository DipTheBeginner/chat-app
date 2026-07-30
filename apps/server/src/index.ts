import http from "http";
import app from "./app";
import { Server } from "socket.io"
import socketAuth from "./socket/socketAuth";
import registerSocketHandlers from "./socket/socketHandler";
import joinRooms from "./socket/joinRooms";


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use(socketAuth);


io.on ("connection", async (socket) => {
  console.log("Connected:", socket.id);
  console.log("User:", socket.data.user);
  await joinRooms(socket);
  registerSocketHandlers(socket)

  socket.onAny((event, ...args) => {
    console.log("Received event:", event, args);
  });

  socket.on("hello", (message) => {
    console.log("Hello event:", message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


