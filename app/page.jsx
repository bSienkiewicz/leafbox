"use client";
import { checkAuth } from '@/authMiddleware';
import WebSocketContext from '@/lib/MessageContext';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import Card from '@/components/Cards/Card';
import { useTokenStore, useWsStore } from '@/store/zustand';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wsMessage, setWsMessage] = useState(null);
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const {token} = useTokenStore();
  const greetings = [
    'Hello',
    'Hi',
    'Hey',
    'Howdy',
    'Hola',
    'Namaste',
    'Salaam',
    'Shalom',
    'What\'s up',
    'How\'s your day',
    'How\'s your day going',
  ]

  useEffect(() => {
    console.log('RERENDER...')
  })
  
  return (
    <div className="h-full md:grid md:grid-cols-12 flex flex-col gap-3">
      <div className="col-span-4">
        <Card cClass={"text-2xl"}>
          <span className='font-medium'>Hello{" "}{user}</span>
        </Card>
      </div>
    </div>
  )
}



export default checkAuth(Home);
