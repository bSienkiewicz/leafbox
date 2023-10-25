"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCloudMoon,
  faHomeUser,
  faLocationArrow,
  faLocationDot,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { faHubspot } from "@fortawesome/free-brands-svg-icons";
import moment from "moment-timezone";
import { Card, CardContent, CardHeader } from "./ui/card";
import toast from "react-hot-toast";
import { useWeatherStore, useAppStore, useWsStore } from "@/store/zustand";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { useThemeContext } from "@/utils/AppContextProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const links = [
  {
    href: "/",
    text: "Home",
    svg: faHomeUser,
  },
  {
    href: "/plants",
    text: "Plants",
    svg: faSeedling,
  },
  {
    href: "/devices",
    text: "Devices",
    svg: faHubspot,
  },
];

const Sidebar = () => {
  const [width, setWidth] = useState(null);
  const { setTheme } = useTheme();

  const { isSidebarOpen, toggleSidebar, isMobile } = useThemeContext();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [wsMessage, setWsMessage] = useState(null);
  const [prevWsConnected, setPrevWsConnected] = useState(null);

  const WsStatus = useWsStore((s) => s.status);
  const WsConnected = useWsStore((s) => s.connected);
  const setLocation = useWeatherStore((s) => s.setLocation);

  const weather = useWeatherStore((s) => s.weather);

  useEffect(() => {
    if (!WsStatus) return;
    if (WsStatus.topic !== "status") return;
    setWsMessage(WsStatus);
  }, [WsStatus]);

  useEffect(() => {
    const geoInterval = setInterval(checkGeolocation, 10 * 60 * 1000);
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(geoInterval);
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (prevWsConnected && !WsConnected)
      toast.error("Disconnected from the server");
    setPrevWsConnected(WsConnected);
  }, [WsConnected]);

  useEffect(() => {
    checkGeolocation();
  }, [token]);

  const checkGeolocation = () => {
    console.log("Checking geolocation");
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position.coords);
      if (weather != null || token == null) return;
      axios
        .get(
          `http://api.weatherapi.com/v1/current.json?q=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_WEATHERAPI_KEY}`
        )
        .then((res) => {
          useWeatherStore.setState({ weather: res.data });
        });
    });
  };

  const handleLinkClick = (e) => {
    if (isMobile) toggleSidebar();
  };

  const currentRoute = usePathname().split("/")[1];

  return (
    token && (
      <div
        className={`h-full w-full flex flex-col gap-3 md:relative absolute top-0 left-0 z-40 transition-all duration-500 ease-in-out bg-transparent opacity-0 md:bg-transparent ${
          isSidebarOpen || !isMobile
            ? "translate-x-0 bg-black/50 opacity-100"
            : "-translate-x-full"
        }`}
      >
        <div className="flex-1 flex flex-col gap-3 overflow-auto p-2 md:p-0">
          <div className="relative h-14 flex gap-3">
            <div className="h-14 w-14 flex md:hidden" onClick={toggleSidebar}>
              <Card
                className={
                  "h-full w-full flex justify-center items-center p-0 cursor-pointer"
                }
              >
                <FontAwesomeIcon icon={faBars} />
              </Card>
            </div>
            <Card
              className={
                "flex-1 !flex items-center flex-row flex-nowrap gap-3 w-full p-6"
              }
            >
              <p className="text-3xl font-bold">
                {moment(currentTime).format("HH:mm")}
              </p>
              <span className="text-xs font-light text-gray-300">
                {moment(currentTime).format("dddd, DD MMMM YYYY")}
              </span>
            </Card>
          </div>
          {weather && (
            <Card>
              <CardHeader>
                <p className="text-sm font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {weather.location.name}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <span className="text-5xl flex gap-2">
                  {weather.current.temp_c.toFixed(0)}
                  <span className="text-lg align-top">°C</span>
                  <span className="flex flex-col justify-around ms-2">
                    <span className="text-xs font-light ">
                      FEEL: {weather.current.feelslike_c}°C
                    </span>
                    <span className="text-xs font-light ">
                      CLOUD: {weather.current.cloud}%
                    </span>
                  </span>
                  <span className="ml-auto">
                    <FontAwesomeIcon icon={faCloudMoon} />
                  </span>
                </span>
                <div className="grid grid-cols-3">
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-light uppercase">Humidity</p>
                    <p className="text-sm font-bold">
                      {weather.current.humidity}%
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-light uppercase">Precip.</p>
                    <p className="text-sm font-bold">
                      {weather.current.precip_mm}mm
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-light uppercase">
                      Wind{" "}
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        className="font-bold"
                        style={{
                          rotate: `${-45 + weather.current.wind_degree}deg`,
                        }}
                      />
                    </p>
                    <p className="text-sm font-bold">
                      {weather.current.wind_kph}km/h{" "}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className={`flex flex-col w-full p-6`}>
            {links.map(({ href, text, svg }, i) => (
              <Link
                key={i}
                href={href}
                className="flex gap-3 items-center border-b pb-3 pt-3 first:pt-0 last:pb-0 last:border-0 border-neutral-600"
                onClick={handleLinkClick}
              >
                <FontAwesomeIcon icon={svg} />
                <span className="">{text}</span>
              </Link>
            ))}
          </Card>
          {wsMessage && (
            <Card title={"System status"}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center">
                  <p className="">CPU</p>
                  <p>{Math.round(wsMessage?.data.cpu.usage)}%</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="">Memory</p>
                  <p>
                    {Math.round(
                      (wsMessage?.data.ram.free / wsMessage?.data.ram.total) *
                        -100 +
                        100
                    )}
                    %
                  </p>
                </div>
              </div>
            </Card>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card className={"py-2 px-6 !fixed bottom-0 left-0 w-full"}>
          <div className="text-xs text-gray-300 flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 bg-${
                  WsConnected ? "green" : "red"
                }-500 rounded-full`}
              ></span>
              {prevWsConnected === null
                ? "Connecting..."
                : WsConnected
                ? "Server online"
                : "Server offline"}
            </div>
            <Link
              href={"/logout"}
              className="rounded-full bg-black/20 px-2 py-1"
            >
              <Button className="text-xs">Logout</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  );
};

export default Sidebar;
