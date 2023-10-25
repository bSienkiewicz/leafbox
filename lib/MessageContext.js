"use client"
import { useWsStore } from '@/store/zustand';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export const WebSocketProvider = () => {
  const setStoreStatus = useWsStore((state) => state.setStatus);
  const setStoreMoisture = useWsStore((state) => state.setMoisture);
  const setStoreConnected = useWsStore((state) => state.setConnected);

  const connect = () => {
    const socket = new WebSocket('ws://localhost:5566');

    socket.addEventListener('open', (event) => {
      setStoreConnected(true);
    });

    socket.addEventListener('close', (event) => {
      setStoreConnected(false);
      
      setTimeout(() => {
        connect();
      }, 2000);
    });

    socket.addEventListener('message', (event) => {
      const receivedMessage = JSON.parse(event.data);
      if (receivedMessage.topic === 'status') {
        setStoreStatus(receivedMessage);
      } else if (receivedMessage.topic === 'moisture') {
        setStoreMoisture(receivedMessage.data);
      }
    });

    return socket;
  };

  useEffect(() => {
    const socket = connect();

    return () => {
      socket.close();
      setStoreConnected(false);
    };
  }, []);

  return null;
};

export default WebSocketProvider;