"use client";
import Chart from "@/components/ChartComponent";
import { getPlantAndReadings } from "@/lib/db";
import React from "react";
import moment from "moment-timezone";
import { checkAuth } from "@/authMiddleware";

const page = ({ params }) => {
  const [plant, setPlant] = React.useState(null);
  const [readings, setReadings] = React.useState(null);
  const [chartData, setChartData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [ws, setWs] = React.useState(null);

  React.useEffect(() => {
    getPlantAndReadings(params.id, 10).then((res) => {
      setPlant(res.plant[0]);
      setReadings(res.readings);
      setLoading(false);
    });
  }, []);

  
  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:5566");
    setWs(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.topic !== "moisture") return;
      const plant_id = message.data.plant_id;
      const moisture_value = Buffer.from(message.data.moisture_value, "base64").toString()
      const timestamp = message.data.timestamp;
      if (plant_id === params.id) {
        setReadings((prev) => {
          const newReadings = [...prev];
          newReadings.unshift({ moisture_value, timestamp });
          newReadings.pop();
          return newReadings;
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  React.useEffect(() => {
    const labels = readings
      ?.map((reading) => moment(reading.timestamp).format("HH:mm"))
      .reverse();
    const moistureValues = readings
      ?.map((reading) => reading.moisture_value)
      .reverse();
    const data = {
      labels: labels,
      datasets: [
        {
          data: moistureValues,
        },
      ],
    };
    setChartData(data);
  }, [readings]);

  return (
    <div className="relative grid grid-rows-[208px,1fr] h-auto md:h-full">
      <div className="w-full h-full bg-black md:px-16 px-2 py-8 relative items-center text-white">
        <div className="flex items-center gap-5">
          {plant?.device_name && (
            <>
              <div
                className="h-32 aspect-square rounded transition-all ease duration-200"
                style={{
                  background: `url(${plant?.image}) no-repeat center center/cover`,
                }}
              ></div>
              <div className="">
                <p className="text-sm text-gray-600 font-bold">
                  {plant?.device_name} slot {plant?.slot}
                </p>
                <h1 className="text-4xl font-bold">{plant?.plant_name}</h1>
                <p className="text-sm italic">{plant?.species}</p>
              </div>
            </>
          )}
          {readings?.length > 0 && (
            <div className="ml-auto md:flex gap-5 hidden">
              <div className="">
                <p className="text-lg">Last watering</p>
                <p className="text-2xl font-bold">
                  {moment
                    .utc(readings?.[0]?.timestamp)
                    .utcOffset(-120, true)
                    .fromNow()}
                </p>
              </div>
              <div className="">
                <p className="text-lg">Moisture</p>
                <p className="text-2xl font-bold">
                  {readings?.[0]?.moisture_value}%
                </p>
              </div>
            </div>
          )}
        </div>
        <div
          className="absolute h-1 bg-blue-400 left-0 bottom-0 w-0 transition-all duration-1000 ease-out"
          style={{ width: `${readings?.[0]?.moisture_value}%` }}
        ></div>
      </div>
      <div className="flex flex-col h-full w-full px-16">
        <div className="flex flex-col gap-2 mt-3">
          <span htmlFor="desc" className="">
            Description
          </span>
          <textarea
            name="desc"
            id="desc"
            rows={3}
            className="w-full rounded border-2 border-zinc-300 bg-gradient-to-b from-zinc-200 to-white resize-none p-3"
          ></textarea>
        </div>
        <div className="grid grid-rows-1 grid-cols-[40%,60%] flex-1">
          <div className="LEFT"></div>
          <div className="RIGHT py-5 relative">
            {!loading && (
              <>
                <div className="absolute top-5 right-5 rounded-full bg-black px-2 py-1 text-white text-xs flex items-center gap-1 pointer-events-none">
                  <div className="relative h-3 w-3">
                    <span
                      className={`animate-ping absolute rounded-full bg-blue-300 w-full h-full inline-flex opacity-70 dur`}
                    ></span>
                    <span
                      className={`absolute rounded-full bg-blue-300 w-full h-full inline-flex`}
                    ></span>
                  </div>
                  <p>LIVE</p>
                </div>
                <Chart data={chartData} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default checkAuth(page);
