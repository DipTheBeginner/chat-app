"use client";

import { useEffect } from "react";
import { getSocket } from "./app/lib/socket";

export default function Home() {
  useEffect(() => {
    const socket = getSocket();
   
    socket.onmessage=(event)=>{
      const data=JSON.parse(event.data);
    }
    
  }, []);

  return <div>Socket Test</div>;
}