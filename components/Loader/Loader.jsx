"use client"
import React, { useEffect } from "react";
import spin from '../../public/spin.svg'
import leafbox from '../../public/leafbox.svg'
import Image from "next/image";
import { useLoadingStore } from "@/store/zustand";

const Loader = () => {
  const [loading, setLoading] = React.useState(true);
  const setStoreLoading = useLoadingStore(s => s.setLoading);

  useEffect(() => {
    setLoading(false);
    setStoreLoading(false);
  }, []);

  return (
    loading &&
    <div className={`absolute top-0 left-0 w-full h-full flex justify-center items-center animate-pop-in opacity-0 z-30`}>
      <Image src={leafbox} alt="leafbox" width={250} height={"auto"} className="z-30"/>
    </div>
  );
};

export default Loader;
