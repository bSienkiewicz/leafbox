"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes"

const AppContext = createContext({})

export const AppContextProvider = ({ children, ...props }) => {
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
    <NextThemesProvider {...props}>
      <AppContext.Provider value={{ isSidebarOpen, toggleSidebar, setIsSidebarOpen, isMobile, setIsMobile }}>
        {children}
      </AppContext.Provider>
    </NextThemesProvider>
  );
};

export const useThemeContext = () => useContext(AppContext);
export default AppContextProvider;