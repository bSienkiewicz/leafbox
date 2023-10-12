"use client"
import { faHubspot } from '@fortawesome/free-brands-svg-icons';
import { faHomeUser, faSeedling } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import React from 'react'
import Card from './Cards/Card';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppStore } from '@/store/zustand';

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

const BottomNavigation = () => {
  const currentRoute = usePathname().split("/")[1];

  return (
    <div className='fixed bottom-0 left-0 w-full md:hidden z-40'>
      <Card cClass={"flex justify-evenly"}>
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            <div
              className={`flex flex-col justify-center items-center ${
                currentRoute === link.href.split("/")[1]
                  ? "text-white"
                  : "text-gray-300"
              }`}
            >
              <FontAwesomeIcon icon={link.svg} />
              <p className='text-xs'>{link.text}</p>
            </div>
          </Link>
        ))}
      </Card>
    </div>
  )
}

export default BottomNavigation