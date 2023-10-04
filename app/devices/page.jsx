"use client";
import React from "react";
import { getDevices, getPlants } from "@/lib/db";
import Link from "next/link";
import { checkAuth } from "@/authMiddleware";

const page = () => {
  const [plants, setPlants] = React.useState([]);
  const [devices, setDevices] = React.useState([]);

  React.useEffect(() => {
    getPlants().then((plants) => {
      setPlants(plants);
    });
    getDevices().then((dev) => {
      setDevices(dev);
    });
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-visible">
      <div className="h-full w-full pt-10 flex flex-col gap-8 max-w-7xl mx-auto px-5">
        {devices.map((device, i) => (
          <Link
            href={`/devices/${device[`device_id`]}`}
            className="w-full isolate relative max-h-36 group"
            key={i}
          >
            {!device.configured ? (
            <div className="absolute -top-4 right-0 text-xs w-full h-full border-2 rounded-xl border-red-200 text-right text-red-300 pr-5 bg-red-100 -z-10 group-hover:-top-5 transition-all">
              Not configured
            </div>
            ) : null  }
            <div className={`p-4 bg-neutral-50 shadow-md rounded-xl relative z-10 h-full ${!device.configured ? 'border-2 border-red-200' : ''}`}>
              <h3 className="text-xl font-bold">{device[`device_name`]}</h3>
              <h4 className="text-sm text-gray-500 pt-2">
                Location: {device[`location`]}
              </h4>
              <div className="absolute h-3 w-3 top-5 right-5">
                <span
                  className={`animate-ping absolute rounded-full ${
                    device.configured ? "bg-green-300" : "bg-red-300"
                  } w-full h-full inline-flex opacity-70`}
                ></span>
                <span
                  className={`absolute rounded-full ${
                    device.configured ? "bg-green-300" : "bg-red-300"
                  } w-full h-full inline-flex`}
                ></span>
              </div>
              <div className="mt-4 flex gap-2">
                {Array(4)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full h-8 w-8 border-dashed ${
                        device[`plant_${i + 1}`] == null
                          ? "border-gray-300 border-2"
                          : "bg-green-300"
                      }`}
                    ></div>
                  ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default checkAuth(page);
