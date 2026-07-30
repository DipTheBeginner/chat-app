"use client";

import { useEffect } from "react";
import { getSocket } from "./lib/socket";

export default function Home() {
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      console.log("Connected:", socket.id);
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  return <div>Socket Test</div>;
}