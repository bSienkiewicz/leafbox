"use client"
import React from "react";
import { useLoadingStore } from "@/store/zustand";

const background = () => {
  const loading = useLoadingStore((s) => s.loading);

  return (
    <div
      className={`absolute w-full h-full top-0 left-0 bg-black/30 animate-bg after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black/30`}
      style={{
        background:
          "url(https://images.unsplash.com/photo-1491822486797-ccc854cc2345?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80) no-repeat center center/cover",
      }}
    ></div>
  );
};

export default background;
