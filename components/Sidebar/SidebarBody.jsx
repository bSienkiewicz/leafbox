"use client";
import { useThemeContext } from "@/utils/ThemeProvider";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "next-client-cookies";
import React, { use, useEffect, useState } from "react";
import Card from "../Cards/Card";

const SidebarBody = ({ fetchPlants, fetchDevices }) => {
  const [plants, setPlants] = useState([]);
  const [devices, setDevices] = useState([]);
  const [results, setResults] = useState({
    plants: [],
    devices: [],
  });
  const [input, setInput] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);

  const { setIsSidebarOpen } = useThemeContext();

  const fetchData = async () => {
    if (plants.length > 0 && devices.length > 0) return;
    await fetchPlants().then((res) => {
      setPlants(res.data);
    });
    await fetchDevices().then((res) => {
      setDevices(res.data);
    });
  };

  const filterResults = (input) => {
    if (input.trim() === "") {
      setResults({ plants: [], devices: [] });
      return;
    }

    const filteredPlants = plants.filter((plant) => {
      if (
        plant.plant_name.toLowerCase().includes(input.toLowerCase()) ||
        plant.species.toLowerCase().includes(input.toLowerCase()) ||
        plant.plant_id.toString().includes(input.toLowerCase())
      ) {
        return plant;
      }
    });
    const filteredDevices = devices.filter((device) => {
      if (
        device.device_name.toLowerCase().includes(input.toLowerCase()) ||
        device.device_id.toString().includes(input.toLowerCase())
      ) {
        return device;
      }
    });
    const results = {
      devices: { ...filteredPlants },
      plants: { ...filteredDevices },
    };
    setResults(results);
  };

  useEffect(() => {
    console.log(results);
  }, [results]);

  useEffect(() => {
    fetchData();
    filterResults(input);
  }, [input]);

  useEffect(() => {
    console.log(isInputClicked)
  }, [isInputClicked])

  const token = useCookies().get("jwt");
  return (
    token && (
      <div className="relative h-14 flex gap-3 z-40">
        <div
          className="h-14 w-14 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Card cClass={"h-full w-full flex justify-center items-center p-0"}>
            <FontAwesomeIcon icon={faBars} />
          </Card>
        </div>
        <div className="relative h-full flex-1">
          <input
            onFocus={() => setIsInputClicked(true)}
            onBlur={() => setIsInputClicked(false)}
            onInput={(e) => setInput(e.target.value)}
            type="text"
            className={`w-full h-full backdrop-blur-md bg-neutral-700/40 rounded-lg ${
              (Object.keys(results.devices).length > 0 ||
                Object.keys(results.plants).length > 0) &&
              "rounded-b-none"
            } p-4 text-white backdrop-saturate-200 shadow-spot hover:shadow-spot-down transition-all after:shadow-lg hover:after:shadow-xl after:transition-all after:absolute after:w-full after:h-full after:top-0 after:left-0 after:rounded-lg after:z-[-1] placeholder:text-gray-300 text-sm opacity-0 animate-pop-in focus-visible:border-none`}            placeholder="Search for a plant"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="text-white absolute top-0 bottom-0 my-auto right-4"
          />
          {((Object.keys(results.devices).length > 0 ||
            Object.keys(results.plants).length > 0 ) &&
            isInputClicked) && (
            <div className="bg-red-500 p-3 z-40 rounded-b-lg">
              <p className="text-white text-sm">
                {Object.keys(results.devices).length} devices and{" "}
                {Object.keys(results.plants).length} plants found
              </p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default SidebarBody;
