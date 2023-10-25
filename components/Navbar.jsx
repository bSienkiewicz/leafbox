"use client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EnvelopeClosedIcon,
  GearIcon,
  PersonIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import logo from "@/public/leafbox.svg";
import logo_sm from "@/public/leafbox_sm.svg";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownLong,
  faArrowRightLong,
  faBars,
  faDiamond,
  faLeaf,
  faLocationArrow,
  faLocationDot,
  faRightFromBracket,
  faSearch,
  faTableColumns,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { faHubspot, faPagelines } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { useCookies } from "next-client-cookies";
import { useWeatherStore, useWsStore } from "@/store/zustand";
import { Badge } from "./ui/badge";
import { getDevices, getPlants } from "@/app/_actions";

const links = [
  {
    href: "/",
    text: "Home",
    icon: faTableColumns,
  },
  {
    href: "/plants",
    text: "Plants",
    icon: faPagelines,
  },
  {
    href: "/devices",
    text: "Devices",
    icon: faHubspot,
  },
];

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentRoute = usePathname().split("/")[1];
  const [open, setOpen] = React.useState(false);
  const [currentTheme, setCurrentTheme] = useState("");
  const [plants, setPlants] = useState([]);
  const [devices, setDevices] = useState([]);
  const { setTheme } = useTheme();
  const token = useCookies().get("jwt");

  // const WsStatus = useWsStore((s) => s.status); // Status of the server connection
  const WsConnected = useWsStore((s) => s.connected);

  const toggleTheme = () => {
    if (typeof window === "undefined") return;
    const themes = ["light", "dark", "system"];
    const currentTheme = localStorage.getItem("theme") || themes[2];
    const nextTheme =
      themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    setTheme(nextTheme);
    setCurrentTheme(nextTheme);
  };

  const fetchAppData = async () => {
    const fetchedPlants = await getPlants()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return [];
      });
    const fetchedDevices = await getDevices()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return [];
      });
    setPlants(fetchedPlants);
    setDevices(fetchedDevices);
  };

  useEffect(() => {
    fetchAppData();

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const down = (e) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);

    if (typeof window !== "undefined") {
      setCurrentTheme(localStorage.getItem("theme"));
    }
    return () => {
      clearInterval(timeInterval);
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    token && (
      <nav className="border-b animate-slide-down !bg-transparent backdrop-blur-md">
        <div className="h-16 flex justify-between items-center px-2 md:px-8 max-w-[1920px] mx-auto">
          <div className="flex items-center">
            <Image src={logo_sm} alt="Logo" height={30} width={"auto"} />
            {/* Navigation */}
            <NavigationMenu className="ml-3 hidden md:block bg-transparent">
              <NavigationMenuList>
                {links.map((link, i) => (
                  <NavigationMenuItem key={i}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={
                          navigationMenuTriggerStyle() +
                          " text-muted-foreground bg-transparent"
                        }
                        data-active={
                          currentRoute === link.href.split("/")[1]
                            ? "true"
                            : undefined
                        }
                      >
                        {link.text}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Time */}
          <p className="text-3xl font-bold">
            {moment(currentTime).format("HH:mm")}
          </p>
          <div className="gap-3 items-center hidden md:flex">
            {/* Search */}
            <div>
              <Button
                variant="outline"
                className="p-2 flex justify-between w-40"
                onClick={() => setOpen(true)}
              >
                <p>
                  <FontAwesomeIcon icon={faSearch} className="pr-2" />
                  Search...
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>F
                </kbd>
              </Button>
              <Dialog
                open={open}
                setOpen={setOpen}
                plants={plants}
                devices={devices}
              />
            </div>
            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="relative">
                <Button className="rounded-full" variant="outline">
                  <div
                    className={`absolute top-0 right-0 h-2 w-2 ${
                      WsConnected ? "bg-green-400" : "bg-gray-400"
                    } rounded-full`}
                  ></div>
                  <FontAwesomeIcon icon={faUser} className="" />
                </Button>
              </DropdownMenuTrigger>
              <ProfileMenu
                toggleTheme={toggleTheme}
                currentTheme={currentTheme}
              />
            </DropdownMenu>
          </div>
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="block md:hidden">
              <Button variant="outline">
                <FontAwesomeIcon icon={faBars} />
              </Button>
            </SheetTrigger>
            <Sidebar />
          </Sheet>
        </div>
      </nav>
    )
  );
};

const Dialog = ({ open, setOpen, plants, devices }) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick access">
          {links.map((link, i) => (
            <Link
              href={link.href}
              passHref
              onClick={() => setOpen(false)}
              key={i}
            >
              <CommandItem className="cursor-pointer">
                <FontAwesomeIcon icon={link.icon} className="mr-2 h-4 w-4" />
                <span>{link.text}</span>
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Plants">
          {plants?.map((plant, i) => (
            <Link
              href={`/plants/${plant.plant_id}`}
              passHref
              key={i}
              onClick={() => setOpen(false)}
            >
              <CommandItem className="cursor-pointer">
                <FontAwesomeIcon icon={faLeaf} className="mr-2 h-4 w-4" />
                <span className="flex justify-between w-full">
                  {plant.plant_name}{" "}
                  <span className="text-xs text-gray-300">
                    ID: {plant.plant_id}
                  </span>
                </span>
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Devices">
          {devices?.map((device, i) => (
            <Link
              href={`/devices/${device.device_id}`}
              passHref
              key={i}
              onClick={() => setOpen(false)}
            >
              <CommandItem className="cursor-pointer">
                <FontAwesomeIcon icon={faDiamond} className="mr-2 h-4 w-4" />
                <span>{device.device_name}</span>
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

const ProfileMenu = ({ toggleTheme, currentTheme }) => {
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuItem className="flex justify-between" onClick={toggleTheme}>
        Theme <Badge className={"uppercase"}>{currentTheme}</Badge>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/logout" passHref className="text-red-500 font-bold">
          Logout
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const ThemeSwitcher = ({ setTheme }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
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
  );
};

const Sidebar = () => {
  const currentRoute = usePathname().split("/")[1];

  return (
    <SheetContent>
      <SheetHeader className={"flex"}>
        <Image
          src={logo}
          alt="Logo"
          height={40}
          width={"auto"}
          className="mx-auto"
        />
      </SheetHeader>
      <div className="mt-5 flex flex-col gap-5">
        {links.map((link, i) => (
          <SheetClose asChild key={i} className="w-full">
            <Link
              href={link.href}
              key={i}
              passHref
              data-active={
                currentRoute === link.href.split("/")[1] ? "true" : undefined
              }
              className={
                navigationMenuTriggerStyle() +
                " text-muted-foreground text-xl !flex text-center !w-full"
              }
            >
              {link.text}
              <FontAwesomeIcon icon={faArrowRightLong} className="ml-auto" />
            </Link>
          </SheetClose>
        ))}

        <Link
          href="/logout"
          passHref
          className={
            navigationMenuTriggerStyle() +
            " text-red-400 text-xl text-left !flex !w-full mt-5"
          }
        >
          Logout
          <FontAwesomeIcon icon={faRightFromBracket} className="ml-auto" />
        </Link>
      </div>
    </SheetContent>
  );
};
export default Navbar;
