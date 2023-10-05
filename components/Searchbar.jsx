"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTokenStore } from "@/store/zustand";

const Searchbar = () => {
  const pathname = usePathname();
  const token = useTokenStore((s) => s.token);

  return (
    token && (
    <div className="overflow-hidden relative h-14">
      <input
        type="text"
        className="w-full h-full backdrop-blur-md bg-neutral-700/40 rounded-lg p-4 text-white backdrop-saturate-200 shadow-spot hover:shadow-spot-down transition-all after:shadow-lg hover:after:shadow-xl after:transition-all after:absolute after:w-full after:h-full after:top-0 after:left-0 after:rounded-lg after:z-[-1] placeholder:text-gray-300 text-sm opacity-0 animate-pop-in"
        placeholder="Search for a plant"
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="text-white absolute top-0 bottom-0 my-auto right-4"
      />
    </div>
  ));
};

export default Searchbar;
