"use client";
import React from "react";
import Image from "next/image";
import leafbox from "../public/leafbox.svg";
import leafboxsm from "../public/leafbox_sm.svg";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faChevronDown, faGears, faHome, faHomeUser, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { faHubspot } from "@fortawesome/free-brands-svg-icons";

const links = [
  {
    href: "/",
    text: "Dashboard",
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
  {
    href: "/settings",
    text: "Settings",
    svg: faGears,
  },
];

const Navbar = () => {
  const [width, setWidth] = React.useState(null);
  const jwt = localStorage.getItem('jwt')
  const user = localStorage.getItem('user')

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  const currentRoute = usePathname().split("/")[1];
  
  return (
    <>
      <div className="h-[88px] shadow-2xl">
        <div className="flex items-center px-8 h-full w-full bg-black">
          {width > 768 && (
            <Image
              priority
              src={leafbox}
              alt="leafbox"
              width={124}
              height={35}
            />
          )}
          {width <= 768 && (
            <Image
              priority
              src={leafboxsm}
              alt="leafbox"
              width={35}
              height={35}
            />
          )}
          {jwt && (
            <>
              <div className="flex gap-2 ml-8">
                {links.map(({ href, text, svg }, i) => (
                  <Link
                    key={i}
                    href={href}
                    className={`${
                      currentRoute === href.split("/")[1]
                        ? "after:opacity-100"
                        : "after:opacity-0 hover:after:opacity-100 after:scale-x-0 hover:after:scale-x-100 after:transition-all after:origin-left after:duration-300"
                    } py-4 after:w-full after:bg-white after:h-0.5 after:right-0 after:bottom-2 after:absolute mx-4 rounded-full text-white flex items-center relative uppercase font-medium text-sm`}
                  >
                    <FontAwesomeIcon icon={svg} className="mr-0 lg:mr-3" />
                    <span className="hidden lg:block">{text}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        {/* <Descriptor title={links.find(link => link.href === currentRoute).text} /> */}
      </div>
    </>
  );
};

export default Navbar;
