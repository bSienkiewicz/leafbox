"use client";
import { checkAuth } from '@/authMiddleware';
import WebSocketContext from '@/lib/MessageContext';
import Image from 'next/image'
import { useEffect, useState, useContext } from 'react';
import moment from 'moment-timezone';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wsMessage, setWsMessage] = useState(null);

  const message = useContext(WebSocketContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    if (message.topic !== 'status') return;
    setWsMessage(message);
  }, [message])
  
  return (
    <div className="mx-10 py-10 h-full md:grid md:grid-cols-[300px,1fr] md:grid-rows-1 flex flex-col gap-3">
      <div className="LEFT flex flex-col gap-3">
        <HomeCard>
          <div className="flex md:block items-center gap-3">
            <p className='text-3xl font-bold'>{moment(currentTime).format("HH:mm")}</p>
            <span className='text-sm font-light text-gray-500'>{moment(currentTime).format("dddd, DD MMMM YYYY")}</span>
          </div>
        </HomeCard>
        {wsMessage && (
        <HomeCard title={"System status"}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center">
              <p className=''>CPU</p>
              <p>{Math.round(wsMessage?.data.cpu.usage)}%</p>
            </div>
            <div className="flex flex-col items-center">
              <p className=''>Memory</p>
              <p>{Math.round((wsMessage?.data.ram.free/wsMessage?.data.ram.total*-100)+100)}%</p>
            </div>
          </div>
        </HomeCard>
        )}
      </div>
      <div className="RIGHT flex flex-col gap-3">
        <input type="text" className="bg-neutral-100 border rounded-xl p-4 animate-pop-in shadow-sm hover:shadow-lg transition-all" placeholder="Search for a plant" />
      </div>
    </div>
  )
}

const HomeCard = ({children, title, cls}) => {
  return (
    <div className={`bg-neutral-100 border rounded-xl shadow-lg p-4 animate-pop-in ${cls} shadow-sm hover:shadow-lg transition-all`}>
      {title && (<p className="text-lg font-bold mb-3">{title}</p>)}
      {children}
    </div>
  )
}

export default checkAuth(Home);
