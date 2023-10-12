"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({})

export const ThemeProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    if (typeof window === "undefined") return;
    mediaQuery.addEventListener("change", handleResize);

    if (!isMobile) setIsSidebarOpen(true);
    handleResize();

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ isSidebarOpen, toggleSidebar, setIsSidebarOpen, isMobile, setIsMobile }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
export default ThemeProvider;