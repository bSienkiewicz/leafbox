"use client";
import React, { useEffect, useState } from "react";
import { useWsStore } from "@/store/zustand";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const RecentReadings = () => {
  const [usage, setUsage] = useState(null);
  const message = useWsStore((s) => s.status);

  useEffect(() => {
    if (message === null) return;
    setUsage(message.data);
  }, [message]);

  return (
    usage && (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Server usage</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <p>CPU: {usage.cpu.usage}%</p>
            <div className="hidden md:flex h-2 w-full bg-white rounded-full relative">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-green-500 rounded-s-full transition-all" style={{width: `${usage.cpu.usage}%`}}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <p>RAM: {parseFloat((usage.ram.free / usage.ram.total) * 100).toFixed(2)}%</p>
            <div className="hidden md:flex h-2 w-full bg-white rounded-full relative">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-green-500 rounded-s-full transition-all" style={{width: `${parseFloat((usage.ram.free / usage.ram.total) * 100)}%`}}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default RecentReadings;
