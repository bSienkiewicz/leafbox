"use client";
import React from "react";
import { useLoadingStore } from "@/store/zustand";
import { useThemeContext } from "@/utils/ThemeProvider";
import BottomNavigation from "./BottomNavigation";

const MainContent = ({ children }) => {
  const { isSidebarOpen, toggleSidebar, setIsSidebarOpen, isMobile } =
    useThemeContext();
  return (
    <>
      <div
        className={`absolute w-full h-full top-0 left-0 bg-black/30 animate-bg after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black/30 -z-10`}
        style={{
          background:
            "url(https://images.unsplash.com/photo-1491822486797-ccc854cc2345?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80) no-repeat center center/cover",
        }}
      ></div>
      <div
        className={`${
          isMobile && isSidebarOpen ? "opacity-0" : "opacity-100"
        } transition-all duration-300 grid grid-rows-[56px,1fr] gap-3`}
      >
        {children}
        <BottomNavigation />
      </div>
    </>
  );
};

export default MainContent;
