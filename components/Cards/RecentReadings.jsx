"use client";
import { getLastPlantUpdates } from "@/app/_actions";
import React, { useEffect, useState } from "react";
import SmallChartCard from "./SmallChartCard";

const RecentReadings = () => {
  const [lastPlantUpdates, setLastPlantUpdates] = useState(null);
  const readingsAmmount = 15;

  async function initGet() {
    const lastPlants = await getLastPlantUpdates(3).then((res) => { return res.data });

    setLastPlantUpdates(lastPlants);
  }

  useEffect(() => {
    initGet();
  }, []);

  return (
    lastPlantUpdates ? 
    lastPlantUpdates.map((plant) => {
      return <SmallChartCard plantId={plant.plant_id} readingsAmmount={readingsAmmount} key={plant.plant_id} />
    }) : (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  )
};

export default RecentReadings;
