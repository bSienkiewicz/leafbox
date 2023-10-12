"use client"
import React, { useEffect } from "react";
import spin from '../../public/spin.svg'
import leafbox from '../../public/leafbox.svg'
import Image from "next/image";
import { useLoadingStore } from "@/store/zustand";

const Loader = () => {
  return (
    <p>Loading...</p>
  )
};

export default Loader;
