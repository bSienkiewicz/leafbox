import Image from 'next/image'
import React from 'react'
import logo from "@/public/leafbox.svg"

export default function Loading() {
  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center z-50 opacity-0 animate-[pop-up_0.5s_ease-out_forwards]">
      <Image src={logo} alt="leafbox" width={200} height={"auto"} className="animate-pop-in" priority/>
    </div>
  )
}