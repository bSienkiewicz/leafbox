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
  faBars,
  faSearch,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);
  return (
    <div className="border-b">
      <div className="h-16 flex justify-between items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <p className="text-3xl font-bold">
            {moment(currentTime).format("HH:mm")}
          </p>
          <NavigationMenu className="ml-3 hidden md:block">
            <NavigationMenuList>
              {links.map((link, i) => (
                <NavigationMenuItem key={i}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() + " text-muted-foreground"
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
        <Link href="/" passHref>
          <Image
            src={logo}
            alt="Logo"
            className="hidden lg:block"
            height={30}
            width={"auto"}
          />
          <Image
            src={logo_sm}
            alt="Logo"
            className="block lg:hidden"
            height={30}
            width={"auto"}
          />
        </Link>
        <div className="gap-3 items-center hidden md:flex">
          <div>
            <Button
              variant="outline"
              className="p-2 flex justify-between w-56"
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
            <Dialog open={open} setOpen={setOpen} />
          </div>
          <ThemeSwitcher setTheme={setTheme} />
        </div>
        <Sheet>
          <SheetTrigger asChild className="block md:hidden">
            <Button variant="outline">
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </SheetTrigger>
          <Sidebar />
        </Sheet>
      </div>
    </div>
  );
};

const Dialog = ({ open, setOpen }) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick access">
          {links.map((link, i) => (
            <Link href={link.href} passHref onClick={() => setOpen(false)} key={i}>
              <CommandItem className="cursor-pointer">
                <FontAwesomeIcon icon={link.icon} className="mr-2 h-4 w-4" />
                <span>{link.text}</span>
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <PersonIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
            <span>Mail</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <GearIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
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
          <SheetClose asChild key={i}>
            <Link
              href={link.href}
              key={i}
              passHref
              data-active={
                currentRoute === link.href.split("/")[1] ? "true" : undefined
              }
              className={
                navigationMenuTriggerStyle() +
                " text-muted-foreground text-xl flex text-center"
              }
            >
              {link.text}
            </Link>
          </SheetClose>
        ))}
      </div>
    </SheetContent>
  );
};
export default Navbar;
