"use client";
import { useWsStore } from "@/store/zustand";
import moment from "moment-timezone";
import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "@/components/Cards/Card";
import toast from "react-hot-toast";
import Chart from "@/components/ChartComponent";
import { putPlant } from "@/lib/db";

const PlantDisplay = ({ plant_res, readings_res, loading_res, modifyPlant, params }) => {
  const [chartData, setChartData] = useState(null);
  const [plant, setPlant] = useState(null);
  const [readings, setReadings] = useState(null);
  const [loading, setLoading] = useState(null);
  const message = useWsStore((s) => s.moisture);
  let readingsAmmount = 25;

  useEffect(() => {
    setPlant(plant_res);
    setReadings(readings_res);
    setLoading(loading_res);
  }, [plant_res, readings_res, loading_res]);

  const handleInputChange = (event, type) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: event.target.value,
    }));
  };

  const handleThresholdInput = (event, type) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: parseInt(event.target.value),
    }));
  };

  const updatePlant = async () => {
    await modifyPlant(plant)
      .then((res) => {
        if (res.code === 200) {
          toast.success("Plant updated successfully");
        } else {
          toast.error("Error updating plant");
        }
      })
      .catch((err) => {
        toast.error("Unknown error");
        toast.error("Error updating plant");
      });
  };

  useEffect(() => {
    if (readings === null) return;
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

  useEffect(() => {
    if (message === null) return;
    const plant_id = message.plant_id;
    const moisture_value = Buffer.from(
      message.moisture_value,
      "base64"
    ).toString();
    const timestamp = message.timestamp;
    if (plant_id === params.id) {
      setReadings((prev) => {
        if (prev && typeof prev[Symbol.iterator] === "function") {
          const newReadings = [...prev];
          newReadings.unshift({ moisture_value, timestamp });
          if (newReadings.length > readingsAmmount) newReadings.pop();
          return newReadings;
        }
        return [];
      });
    }
  }, [message]);

  return (
    plant &&
    readings &&
    !loading && (
      <>
        <Card cClass="w-full relative items-center text-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex gap-3 items-center">
              <div
                className="h-12 md:h-24 aspect-square rounded transition-all ease duration-200"
                style={
                  plant?.image
                    ? {
                        background: `url(${plant?.image}) no-repeat center center/cover`,
                      }
                    : {
                        background: `url(/placeholder.webp) no-repeat center center/cover`,
                      }
                }
              ></div>
              <div className="">
                {plant?.device_name ? (
                  <Link
                    href={`/devices?mark=${plant?.device_name}`}
                    className="text-sm text-gray-300 font-bold"
                  >
                    {plant?.device_name} slot {plant?.slot}
                  </Link>
                ) : (
                  <p className="text-sm text-red-300 font-bold">
                    Not connected to any device
                  </p>
                )}
                <input
                  className="text-4xl font-bold bg-transparent transition-all focus:bg-black/20 w-full"
                  value={plant?.plant_name}
                  onChange={(e) => handleInputChange(e, "plant_name")}
                  onBlur={updatePlant}
                />
                <input
                  className="text-sm italic bg-transparent transition-all focus:bg-black/20"
                  value={plant?.species}
                  onChange={(e) => handleInputChange(e, "species")}
                  onBlur={updatePlant}
                />
              </div>
            </div>
            {readings?.length > 0 && (
              <div className="ml-auto lg:flex gap-5 hidden">
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
        </Card>

        <div className="flex flex-col gap-2">
          <span htmlFor="desc" className="font-medium">
            Description
          </span>
          <textarea
            name="desc"
            id="desc"
            rows={3}
            className="w-full rounded-lg backdrop-blur-sm bg-neutral-700/20 shadow-spot backdrop-saturate-200 resize-none p-3 text-gray-300 text-sm"
            placeholder="Enter a description for this plant"
            value={plant?.description}
            onBlur={updatePlant}
            onInput={(e) => handleInputChange(e, "description")}
          ></textarea>
        </div>
        <div className="grid grid-rows-1 grid-cols-12 flex-1 gap-3">
          <div className="LEFT col-span-12 xl:col-span-4">
            <Card>
              <p>Watering threshold</p>
              <div className="flex gap-2">
                <p>From</p>
                <input
                  type="range"
                  className="w-full"
                  min={0}
                  max={100}
                  value={plant?.lower_threshold}
                  onChange={(e) => handleThresholdInput(e, "lower_threshold")}
                />
                <p>{plant?.lower_threshold}</p>
              </div>
              <div className="flex gap-2">
                <p>To</p>
                <input
                  type="range"
                  className="w-full"
                  min={0}
                  max={100}
                  value={plant?.upper_threshold}
                  onChange={(e) => handleThresholdInput(e, "upper_threshold")}
                />
                <p>{plant?.upper_threshold}</p>
              </div>
              <button
                onClick={updatePlant}
                className="px-2 py-1 text-sm bg-black text-white rounded-full"
              >
                Save
              </button>
            </Card>
          </div>
          <div className="RIGHT relative col-span-12 xl:col-span-8">
            <Card>
              {plant?.device_name && (
                <div className="absolute top-3 right-3 rounded-full bg-black/20 backdrop-blur-lg px-2 py-1 text-white text-xs flex items-center gap-1 pointer-events-none z-30">
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
              )}
              {chartData && (
                <Chart
                  data={chartData}
                  min={plant?.lower_threshold}
                  max={plant?.upper_threshold}
                />
              )}
            </Card>
          </div>
        </div>
      </>
    )
  );
};

export default PlantDisplay;
