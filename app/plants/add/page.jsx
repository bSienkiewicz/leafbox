"use client";
import { checkAuth } from "@/authMiddleware";
import Card from "@/components/Cards/Card";
import { getPlantLookup } from "@/lib/db";
import { useState } from "react";

const page = () => {
  const [plant, setPlant] = useState({
    plant_name: "",
    location: "",
    image: "",
    species: "",
    min_threshold: 0,
    max_threshold: 0,
  });
  const [plantInfo, setPlantInfo] = useState(null);

  const handleInputChange = (event, type) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: event.target.value,
    }));
  };

  const handlePlantExpert = (e) => {
    e.preventDefault();
    if (plant.species === "") return;
    const species_formatted = plant.species.replace(/[^a-zA-Z0-9 ]/g, '');
    species_formatted.replace(" ", "_");
    getPlantLookup(species_formatted).then((res) => {
      setPlantInfo(res.data);
    }).catch((err) => {
      console.log(err)
    })
  };

  return (
    <div className="relative flex flex-col gap-3">
      <p className="font-medium">Add a new plant</p>
      <div className="flex flex-col gap-3">
        <Card>
          <div className="grid grid-cols-[130px,1fr] gap-3 items-center">
            <label htmlFor="plantName" className="text-gray-300 ps-3">
              Plant name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
              name="plantName"
              id="plantName"
              placeholder="Enter a name for this plant"
              onChange={(e) => handleInputChange(e, "plant_name")}
              value={plant.plant_name}
              required
            />
            <label htmlFor="location" className="text-gray-300 ps-3">
              Location
            </label>
            <input
              type="text"
              className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
              name="location"
              id="location"
              onChange={(e) => handleInputChange(e, "location")}
              placeholder="Enter a location for this plant"
            />
            <div className="w-28 h-28 rounded-lg bg-gray-300/20"></div>
            <input
              type="text"
              className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
              name="image"
              id="image"
              onChange={(e) => handleInputChange(e, "image")}
              placeholder="Enter a URL for a nice image of this plant"
            />
          </div>
        </Card>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4">
            <Card>elo</Card>
          </div>
          <div className="col-span-8">
            <Card title={"PlantExpert"} cClass={"overflow-y-auto"}>
              <p className="text-sm text-gray-300 mb-3">
                Enter a species name to get more information about this plant
              </p>
              <form className="relative w-full box-content" onSubmit={e => handlePlantExpert(e)}>
                <input
                  type="text"
                  className="bg-white/20 rounded-md px-3 py-1 text-md w-full relative"
                  name="image"
                  id="image"
                  onChange={(e) => handleInputChange(e, "species")}
                  placeholder="Enter a species for this plant (e.g. 'Aloe vera')"
                />
                <div className="absolute right-2 top-0 h-full flex items-center">
                  <button
                    className="px-2 py-1 text-xs bg-black/30 rounded-full"
                    type="submit"
                  >
                    Search
                  </button>
                </div>
              </form>
              {plantInfo && (
                <div className="flex flex-wrap gap-1 mt-3 text-sm">
                  <span className="bg-white/20 rounded-full px-3 py-1">Name: {plantInfo["Common Name"].split(",")[0]}</span>
                  <span className="bg-white/20 rounded-full px-2 py-1">Edibility: {plantInfo["Edibility Rating"]/5*100}%</span>
                  <span className="bg-white/20 rounded-full px-2 py-1">Medicinal: {plantInfo["Medicinal Rating"]/5*100}%</span>
                  <span className="bg-white/20 rounded-full px-2 py-1">Soil moisture: {plantInfo["Lower Threshold"]}% - {plantInfo["Upper Threshold"]}%</span>
                  <span className="bg-white/20 rounded-lg px-2 py-1">Known Hazards: {plantInfo["Known Hazards"]}</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default checkAuth(page);
