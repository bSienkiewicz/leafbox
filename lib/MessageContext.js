"use client"
import { useWsStore } from '@/store/zustand';
import React, { createContext, useEffect, useMemo, useState } from 'react';

export const WebSocketProvider = () => {
  const setStoreStatus = useWsStore((state) => state.setStatus);
  const setStoreMoisture = useWsStore((state) => state.setMoisture);
  const setStoreConnected = useWsStore((state) => state.setConnected);
  
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5566');

    socket.addEventListener('open', (event) => {
      setStoreConnected(true);
    });

    socket.addEventListener('close', (event) => {
      setStoreConnected(false);
    });

    socket.addEventListener('message', (event) => {
      const receivedMessage = JSON.parse(event.data);
      if (receivedMessage.topic === 'status') {
        setStoreStatus(receivedMessage);
      } else if (receivedMessage.topic === 'moisture') {
        setStoreMoisture(receivedMessage.data);
      }
    });
    
    return () => {
      socket.close();
      setStoreConnected(false);
    };
  }, []);
};

export default WebSocketProvider;