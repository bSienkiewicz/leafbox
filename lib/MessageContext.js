"use client";
import { newSocket } from "@/app/_actions";
import { useWsStore } from "@/store/zustand";
import React, { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const setStoreStatus = useWsStore((state) => state.setStatus);
  const setStoreMoisture = useWsStore((state) => state.setMoisture);
  const setStoreConnected = useWsStore((state) => state.setConnected);
  const [calibrationMessage, setCalibrationMessage] = useState(null);
  const [socket, setSocket] = useState(null);

  const connect = () => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}`);

    ws.addEventListener("open", (event) => {
      setStoreConnected(true);
      console.log("[WS ready]");
    });

    ws.addEventListener("close", (event) => {
      setStoreConnected(false);

      setTimeout(() => {
        connect();
      }, 2000);
    });

    ws.addEventListener("message", (event) => {
      const receivedMessage = JSON.parse(event.data);
      if (receivedMessage.topic === "status") {
        setStoreStatus(receivedMessage);
      } else if (receivedMessage.topic === "moisture") {
        setStoreMoisture(receivedMessage.data);
      } else if (receivedMessage.topic === "calibration") {
        setCalibrationMessage(receivedMessage.data);
      }
    });

    setSocket(ws);

    return ws;
  };

  useEffect(() => {
    const sock = connect();

    return () => {
      sock.close();
      setStoreConnected(false);
    };
  }, []);

  const sendCommand = (mac, type, data = {}) => {
    console.log(data)
    if (socket) {
      console.log("Sending WS message");
      socket.send(
        JSON.stringify({
          topic: "command",
          data: { type: type, mac: mac, data: data },
        })
      );
    } else {
      console.log("Socket is not connected.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendCommand, calibrationMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
