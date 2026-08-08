let socket: WebSocket | null = null;
let socketPromise: Promise<WebSocket> | null = null;

export function getSocket(): Promise<WebSocket> {
    if (socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve(socket);
    }


    if (socketPromise) {
      return socketPromise;
    }

    socketPromise = new Promise<WebSocket>((resolve, reject) => {
      const token = localStorage.getItem("token")


      socket = new WebSocket(
        `ws://localhost:5000?token=${token}`
      );

      socket.onopen = () => {
        console.log("WebSocket connected");
        resolve(socket!)
      };

      socket.onerror = (error) => {
        console.log("WebSocket error:", error);
        socket = null;
        socketPromise = null;
        reject(error)
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        socket = null;
        socketPromise = null;
      };
    })

    return socketPromise;
}