let socket: WebSocket | null = null;

export function getSocket(): WebSocket {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
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