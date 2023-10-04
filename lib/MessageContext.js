"use client"
import React, { createContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5566');
    
    socket.addEventListener('message', (event) => {
      const receivedMessage = event.data;
      setMessage(JSON.parse(receivedMessage));
    });
    
    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={message}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;