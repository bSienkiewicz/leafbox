"use client";
import React from "react";
import { getDevice, getPlants, getDevices, putDevice } from "@/lib/db";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal";
import Link from "next/link";
import Plant from "@/components/Cards/PlantCard";
import { checkAuth } from "@/authMiddleware";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronRight, faPlay } from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/Cards/Card";

const page = ({ params }) => {
  const [device, setDevice] = React.useState(null);
  const [devices, setDevices] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [plants, setPlants] = React.useState([]);
  const [plantToChange, setPlantToChange] = React.useState(null);
  const [connectedPlants, setConnectedPlants] = React.useState({
    plant_1: null,
    plant_2: null,
    plant_3: null,
    plant_4: null,
  });
  const [plantsInUse, setPlantsInUse] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getDevice(params.id).then((dev) => {
      setDevice(dev[0]);
      setLoading(false);
    });
    getPlants().then((plants) => {
      setPlants(plants);
    });
  }, [params.id]);

  React.useEffect(() => {
    if (device) {
      setConnectedPlants((prev) => {
        const connections = { ...prev };
        for (let i = 1; i <= 4; i++) {
          const plantId = device[`plant_${i}`];
          if (plantId !== undefined) {
            connections[`plant_${i}`] = plantId;
          }
        }
        return connections;
      });
    }
  }, [plants]);

  React.useEffect(() => {
    checkPlantsInUse();
  }, [devices, plants]);

  const checkPlantsInUse = () => {
    const plantsInUse = {};

    devices.forEach((dev) => {
      for (let i = 1; i <= 4; i++) {
        const plantId = dev[`plant_${i}`];
        if (plantId) {
          plantsInUse[plantId] = {
            deviceId: dev.device_id,
            deviceName: dev.device_name,
            slot: i,
          };
        }
      }
    });

    setPlantsInUse(plantsInUse);
  };

  const handlePlantSelect = (slot) => {
    if (devices.length === 0) {
      getDevices().then((dev) => {
        setDevices(dev);
      });
    }
    setPlantToChange(slot);
    setModal(true);
  };

  const handlePlantChange = (plantId) => {
    setConnectedPlants((prev) => {
      const connections = { ...prev };
      // remove plant from previous slot
      for (let i = 1; i <= 4; i++) {
        if (connections[`plant_${i}`] === plantId) {
          connections[`plant_${i}`] = null;
        }
      }
      connections[`plant_${plantToChange}`] = plantId;
      return connections;
    });
    setModal(false);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    putDevice(device.device_id, connectedPlants).then((res) => {
      console.log(res.status);
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex justify-between items-center mb-3 relative">
              <span className="text-2xl">
                <span className="font-bold">{device[`device_name`]}</span>{" "}
                configuration
              </span>
              <button
                className="bg-green-300 text-black rounded-full px-3 py-2 uppercase font-bold text-sm"
                type="submit"
              >
                Submit
              </button>
            </div>
            <Card cClass={"flex flex-col gap-3"}>
              <div className="">
              <label htmlFor="device_name" className="text-gray-300 ps-3">
                Device Name
              </label>
              <input
                type="text"
                className=" bg-slate-700/40 rounded-md px-3 py-1 text-md flex-1"
                name="device_name"
                id="device_name"
                defaultValue={device[`device_name`]}
              /></div>
              <div className="flex gap-3 items-center">
                <label htmlFor="location" className="text-gray-300 ps-3">
                  Location
                </label>
                <input
                  type="text"
                  className=" bg-slate-700/40 rounded-md px-3 py-1 text-md flex-1"
                  name="location"
                  id="location"
                  defaultValue={device[`location`]}
                />
              </div>
            </Card>
            <div className="flex flex-col">
              <p className="text-lg font-bold mb-4">Sockets</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(connectedPlants).map((plant, i) => (
                  <Card className="flex flex-col" key={i}>
                    <div
                      className="flex flex-col items-center justify-center bg-slate-100 rounded-md relative overflow-hidden cursor-pointer isolate"
                      onClick={() => handlePlantSelect(i + 1)}
                    >
                      <div
                        className="w-full h-full top-0 left-0 absolute -z-10 after:w-full after:h-full after:bg-black/40 after:absolute after:top-0 after:left-0"
                        style={{
                          background: `url(${
                            plants.find(
                              (p) => p.plant_id === connectedPlants[plant]
                            )?.image
                          }) center center / cover no-repeat`,
                        }}
                      ></div>
                      <div className="flex flex-col items-center justify-center text-white my-4">
                        <p className="text-lg font-bold">
                          {plants.find(
                            (p) => p.plant_id === connectedPlants[plant]
                          )?.plant_name || "Empty socket"}
                        </p>
                        <p className="text-sm">
                          {plants.find(
                            (p) => p.plant_id === connectedPlants[plant]
                          )?.species || "Select a plant"}
                        </p>
                      </div>
                    </div>
                    <Frame title="Socket settings" socket={i}>
                      <div className="py-3 flex flex-col px-4">
                        <label htmlFor="moistureMin" className="text-sm">
                          0% analog value
                        </label>
                        <input
                          type="number"
                          className="border px-2 py-1 mb-3 text-sm"
                          placeholder="1500"
                        />
                        <label htmlFor="moistureMin" className="text-sm">
                          100% analog value
                        </label>
                        <input
                          type="number"
                          className="border px-2 py-1 text-sm"
                          placeholder="1040"
                        />
                      </div>
                    </Frame>
                  </Card>
                ))}
              </div>
            </div>
          </form>
          {modal && (
            <RenderModal
              plants={plants}
              plantsInUse={plantsInUse}
              handleModalClose={handleModalClose}
              handlePlantChange={handlePlantChange}
              modal={modal}
            />
          )}
          {/* <div className="absolute bottom-0 left-0 w-full h-3/4 bg-red-300 z-20 translate-y-3/4 hover:translate-y-0"></div> */}
        </div>
      )}
    </>
  );
};

const Frame = ({ children, title }) => {
  const [frameExpanded, setFrameExpanded] = React.useState([false]);

  const handleExpandFrame = () => {
    setFrameExpanded((prev) => {
      return !prev;
    });
  };

  return (
    <div className="flex flex-col rounded mt-2">
      <p
        className="text-sm font-medium cursor-pointer text-gray-300"
        onClick={handleExpandFrame}
      >
        <FontAwesomeIcon
          icon={faPlay}
          className={`${frameExpanded ? "" : "rotate-90"} transition-all mr-1`}
        />{" "}
        {title}
      </p>
      <div
        className={`overflow-hidden transition-all ease ${
          !frameExpanded ? "max-h-full" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const RenderModal = ({
  plants,
  plantsInUse,
  handleModalClose,
  handlePlantChange,
}) => {
  return (
    <Modal onClose={handleModalClose}>
      <button
        className="p-3 rounded-full text-md text-center border-2 w-full mb-4"
        onClick={() => handlePlantChange(null)}
      >
        CLEAR
      </button>
      {plants.map((plant, i) => (
        <div
          onClick={() => handlePlantChange(plant.plant_id)}
          className="text-white w-full h-16 p-3 relative rounded-lg shadow isolate overflow-hidden flex mb-4 cursor-pointer "
          style={{
            background: `url(${plant?.image}) center center / cover no-repeat`,
          }}
        >
          <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm"></div>
          <div className="flex justify-between items-center z-20">
            <div className="flex gap-3 items-center">
              <h1 className="text-2xl">{plant?.plant_name}</h1>
              <p className="text-xs text-gray-400">{plant?.device_name}</p>
            </div>
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default checkAuth(page);
