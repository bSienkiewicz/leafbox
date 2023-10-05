"use client";
import Plant from "@/components/Cards/PlantCard";
import React, { Suspense } from "react";
import { getPlants } from "@/lib/db";
import Error from "@/components/Error";
import Loader from "@/components/Loader/Loader";
import { checkAuth } from "@/authMiddleware";
import Card from "@/components/Cards/Card";
import Link from "next/link";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const page = () => {
  const [plants, setPlants] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getPlants()
      .then((res) => {
        res.sort((a, b) => a.plant_id - b.plant_id);
        const uniquePlants = res.filter(
          (plant, index, self) =>
            self.findIndex((p) => p.plant_id === plant.plant_id) === index
        );
        setPlants(uniquePlants);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative h-full">
      {error && <Error err={error} />}
      {loading && <Loader />}
      <div className="flex items-center justify-between">
        <p className="font-medium mb-3">Plants</p>
        <Link href={`/plants/add`} className="hover:bg-white/10 transition-all flex items-center justify-center rounded"><FontAwesomeIcon icon={faPlus} className="p-2"/></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {plants?.map((plant, i) => (
          <Link
            href={`/plants/${plant.plant_id}`}
            key={i}
            prefetch={true}
            className="h-48"
          >
            <Card cClass="w-full h-full flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 min-w-20 min-h-20 rounded-lg"
                style={{
                  background: `url(${plant.image}) center center / cover no-repeat`,
                }}
              ></div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <h1 className="text-xl">{plant.plant_name}</h1>
                    <p className="text-xs text-gray-400">{plant.device_name}</p>
                  </div>
                  {plant.last_moisture_ts ? <p>{plant.last_moisture}%</p> : ""}
                </div>
                <div className="h-full flex flex-col text-xs z-20">
                  <div className="w-full h-2 rounded-full shadow-spot bg-black/20 my-2 relative overflow-hidden">
                    {plant.last_moisture && (
                      <div
                        className="absolute top-0 left-0 h-full w-full"
                        style={{ width: `${plant.last_moisture}%` }}
                      >
                        <div className="bg-blue-500/25 shadow-spot animate-fill absolute h-full w-0"></div>
                      </div>
                    )}
                  </div>
                  <p>
                    {plant.last_moisture_ts
                      ? moment(plant.last_moisture_ts).fromNow() +
                        " (" +
                        moment(plant.last_moisture_ts).format(
                          "HH:mm DD/MM/YY"
                        ) +
                        ")"
                      : "Never"}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default checkAuth(page);
