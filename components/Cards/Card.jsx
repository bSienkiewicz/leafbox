import React from "react";

const Card = ({ children, title, cClass, cStyle }) => {
  return (
    <div
      className={`relative backdrop-blur-md bg-neutral-700/30 hover:bg-neutral-700/40 rounded-lg p-4 opacity-0 text-white backdrop-saturate-200 shadow-spot hover:shadow-spot-down transition-all after:shadow-lg hover:after:shadow-xl after:transition-all after:absolute after:w-full after:h-full after:top-0 after:left-0 after:rounded-lg after:z-[-1] animate-pop-in overflow-hidden ${cClass}`}
      style={cStyle}
    >
      {title && <p className="text-lg font-bold mb-3">{title}</p>}
      {children}
    </div>
  );
};

export default Card;
