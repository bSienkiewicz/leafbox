"use client";
import Loader from "@/components/Loader/Loader";
import Card from "@/components/Cards/Card";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Title, TitleContent, TitleOption } from "@/components/Title";
import { Button } from "@/components/ui/button";

const PlantAdd = ({ addPlant, plantLookup }) => {
  const router = useRouter();
  const [plant, setPlant] = useState({
    plant_name: "",
    location: "",
    image: "",
    species: "",
    description: "",
    lower_threshold: 0,
    upper_threshold: 0,
    temperature_min: 0,
  });
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState(null);

  const handleInputChange = (event, type) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: event.target.value,
    }));
  };

  useEffect(() => {
    console.log(plant);
  }, [plant]);

  const handleExpertClick = (type, values) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: values,
    }));
  };

  const handlePlantExpert = async (e) => {
    e.preventDefault();
    if (plant.species === "") return;
    setLoading(true);
    setPlantInfo(null);
    let species_formatted = plant.species.replace(/[^a-zA-Z0-9 ]/g, "");
    species_formatted = species_formatted.replace(/\s/g, "_");
    console.log(species_formatted);
    await plantLookup(species_formatted)
      .then((res) => {
        if (res.status === 200) {
          setPlantInfo(res.data);
          setLookupError(false);
        } else {
          setLookupError(true);
          toast.error("Couldn't find plant with that species");
        }
      })
      .catch((err) => {
        console.log(err);
        setLookupError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    if (
      plant.plant_name === "" ||
      plant.lower_threshold === null ||
      plant.upper_threshold === null ||
      plant.upper_threshold < plant.lower_threshold
    ) {
      toast.error("There is an error with your input.");
      return;
    }
    await addPlant(plant)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Plant added");
          router.replace(`/plants`);
        } else {
          toast.error("Couldn't add plant");
        }
      })
      .catch((err) => {
        toast.error("Couldn't add plant");
      });
  };

  return (
    <div className="relative flex flex-col gap-3">
    <Title>
      <TitleContent>Plants</TitleContent>
      <TitleOption>
        <Button>
          Submit
        </Button>
      </TitleOption>
    </Title>
      <div className="flex flex-col gap-3">
        <Card>
          <div className="grid grid-cols-[130px,1fr] gap-3 items-center">
            <label htmlFor="plantName" className="text-gray-300 ps-3 text-sm">
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
            <label htmlFor="location" className="text-gray-300 ps-3 text-sm">
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
            <div
              className="w-28 h-28 rounded-lg"
              style={
                plant.image
                  ? {
                      background: `url(${plant.image}) no-repeat center center/cover`,
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }
                  : { background: `url(/placeholder.webp) center/cover` }
              }
            ></div>
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
        <Card cClass={"flex flex-col gap-3"}>
          <label htmlFor="desc" className="text-sm">
            Description
          </label>
          <textarea
            name="desc"
            id="desc"
            rows={3}
            className="w-full rounded-lg backdrop-blur-sm bg-white/20 resize-none p-3 text-gray-300 text-sm"
            placeholder="Enter a description for this plant"
            value={plant.description}
            onChange={(e) => handleInputChange(e, "description")}
          ></textarea>
        </Card>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4">
            <Card cClass={"flex flex-col gap-3"}>
              <div className="">
                <p className="text-sm text-gray-300 mb-3">
                  Soil moisture <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
                    name="lower_threshold"
                    id="lower_threshold"
                    min={0}
                    max={100}
                    onChange={(e) => handleInputChange(e, "lower_threshold")}
                    value={plant.lower_threshold}
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
                    name="upper_threshold"
                    id="upper_threshold"
                    onChange={(e) => handleInputChange(e, "upper_threshold")}
                    min={0}
                    max={100}
                    value={plant.upper_threshold}
                    placeholder="Max"
                  />
                </div>
              </div>
              <div className="">
                <p className="text-sm text-gray-300 mb-3">
                  Minimum Temperature
                </p>
                <input
                  type="number"
                  className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
                  name="temperature_min"
                  id="temperature_min"
                  onChange={(e) => handleInputChange(e, "temperature_min")}
                  value={plant.temperature_min}
                  placeholder="Minimum temperature"
                />
              </div>
            </Card>
          </div>
          <div className="col-span-8">
            <Card title={"PlantExpert"} cClass={"overflow-y-auto"}>
              <p className="text-sm text-gray-300 mb-3">
                Enter a species name to get more information about this plant
              </p>
              <form
                className="relative w-full box-content"
                onSubmit={(e) => handlePlantExpert(e)}
              >
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
                  <span
                    className="bg-white/20 rounded-full px-3 py-1 text-green-200 cursor-pointer underline"
                    onClick={() =>
                      handleExpertClick("plant_name", plantInfo["Common Name"])
                    }
                  >
                    Name: {plantInfo["Common Name"]}
                  </span>
                  <span className="bg-white/20 rounded-full px-2 py-1">
                    Edibility: {(plantInfo["Edibility Rating"] / 5) * 100}%
                  </span>
                  <span className="bg-white/20 rounded-full px-2 py-1">
                    Medicinal: {(plantInfo["Medicinal Rating"] / 5) * 100}%
                  </span>
                  <span
                    className="bg-white/20 rounded-full px-2 py-1 text-green-200 cursor-pointer underline"
                    onClick={() => {
                      handleExpertClick(
                        "lower_threshold",
                        plantInfo?.Thresholds.min
                      );
                      handleExpertClick(
                        "upper_threshold",
                        plantInfo?.Thresholds.max
                      );
                    }}
                  >
                    Soil moisture: {plantInfo?.Thresholds.min}% -{" "}
                    {plantInfo?.Thresholds.max}%
                  </span>
                  <span
                    className="bg-white/20 rounded-full px-2 py-1 text-green-200 cursor-pointer underline"
                    onClick={() =>
                      handleExpertClick(
                        "temperature_min",
                        plantInfo["Min Temperature"]
                      )
                    }
                  >
                    Minimum temperature: {plantInfo["Min Temperature"]}°C
                  </span>
                  <span className="bg-white/20 rounded-lg px-2 py-1">
                    Known Hazards: {plantInfo["Known Hazards"]}
                  </span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantAdd;
