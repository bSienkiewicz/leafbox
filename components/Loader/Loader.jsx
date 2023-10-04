import React from "react";
import spin from '../../public/spin.svg'
import Image from "next/image";

const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <Image src={spin} alt="leafbox" width={120} height={120} />
    </div>
  );
};

export default Loader;
