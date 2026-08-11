let socket: WebSocket | null = null;
let socketPromise: Promise<WebSocket> | null = null;



type SocketMessage = {
  type: string,
  [key: string]: any
}


type MessageListener = (message: SocketMessage) => void;

const listeners = new Set<MessageListener>();


export function subscribeSocket(listener: MessageListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener)
  }
}

export function getSocket(): Promise<WebSocket> {


  //already connected 
  if (socket?.readyState === WebSocket.OPEN) {
    return Promise.resolve(socket);
  }

  //connection already being connected
  if (socketPromise) {
    console.log("⏳ Returning existing socket promise");
    return socketPromise;
  }


  //creating new connection
  socketPromise = new Promise<WebSocket>((resolve, reject) => {

    const token = localStorage.getItem("token")

    if (!token) {
      socketPromise = null;

      reject(new Error("No authentication token"));

      return;
    }



    console.log("CREATING NEW WEBSOCKET");
    const ws = new WebSocket(
      `ws://localhost:5000?token=${token}`
    );

    socket = ws

    ws.onopen = () => { 
      console.log("🟢 WebSocket connected");
      socketPromise = null;
      resolve(ws)
    };

    ws.onmessage = (event) => {



      try {
        const data: SocketMessage = JSON.parse(event.data);

        console.log("websocket message", data);

        listeners.forEach((listener) => {
          listener(data);
        })



      } catch (error) {
        console.error("Failed to parse websocket message", error)
      }

    };

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
      if (socket === ws) {
        socket = null
      }

      socketPromise = null;
      reject(error)
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      if (socket === ws) {
        socket = null;
      }

      socketPromise = null;
    };
  })

  return socketPromise;
}





export async function sendSocketMessage(message : object) {

  const socket = await getSocket();

  if(socket.readyState !== WebSocket.OPEN){
    throw new Error ("websocket is not open")
  }


  socket.send(
    JSON.stringify(message)
  )
  
}