import React from "react";
import moment from "moment-timezone";
import Link from "next/link";

const Plant = ({ data }) => {
  return (
    <Link
      href={`/plants/${data.plant_id}`}
      className="border-2 border-neutral-600 rounded-lg"
    >
      <div
        className="text-white w-full h-full grid grid-rows-2 p-3 relative rounded-md shadow isolate overflow-hidden"
        style={{
          background: `url(${data.image}) center center / cover no-repeat`,
        }}
      >
        <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80"></div>
        <div className="flex justify-between items-center z-20">
          <div className="flex gap-3 items-center">
            <h1 className="text-2xl">{data.plant_name}</h1>
            <p className="text-xs text-gray-400">{data.device_name}</p>
          </div>
          {data.last_moisture_ts ? (
          <p>{data.last_moisture}%</p>
          ) : (
            ""
          )}
        </div>
        <div className="h-full flex flex-col text-xs z-20">
          <hr />
          <div className="py-3">
            <p>
              Last watered:{" "}
              {data.last_moisture_ts
                ? moment(data.last_moisture_ts).fromNow() +
                  " (" +
                  moment(data.last_moisture_ts).format("HH:mm DD/MM/YY") +
                  ")"
                : "Never"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Plant;
