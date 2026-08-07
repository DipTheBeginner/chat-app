let socket: WebSocket | null = null;

export function getSocket(): WebSocket {
  console.log("Current socket:", socket); 
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    console.log("Creating NEW socket");
    const token = localStorage.getItem("token");

    socket = new WebSocket(
      `ws://localhost:5000?token=${token}`
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  return socket;
}