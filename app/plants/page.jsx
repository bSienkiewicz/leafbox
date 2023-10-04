'use client'
import Plant from "@/components/Cards/PlantCard";
import React, { Suspense } from "react";
import { getPlants } from "@/lib/db";
import Error from "@/components/Error";
import Loader from "@/components/Loader/Loader";
import { checkAuth } from "@/authMiddleware";

const page = () => {
  const [plants, setPlants] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getPlants()
      .then((res) => {
        res.sort((a, b) => a.plant_id - b.plant_id);
        const uniquePlants = res.filter((plant, index, self) => self.findIndex(p => p.plant_id === plant.plant_id) === index);
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
    <div className="relative container mx-auto pt-10 h-full">
      {error && (
        <Error err={error} />
      )}
      {loading && (
        <Loader />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {plants?.map((plant, i) => (
          <Plant data={plant} key={i}/>
        ))}
      </div>
    </div>
  );
};


export default checkAuth(page);
