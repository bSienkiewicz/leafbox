"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPlay } from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/Cards/Card";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";

const DeviceSettings = ({ plants, devices, params, modifyDevice }) => {
  const router = useRouter();
  const [plantsInUse, setPlantsInUse] = useState({});
  const [device, setDevice] = useState(null);
  const [modal, setModal] = useState(false);
  const [plantToChange, setPlantToChange] = useState(null);
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

  useEffect(() => {
    devices.forEach((dev) => {
      if (dev.device_id == params.id) {
        setDevice(dev);
      }
    });
  }, [devices, params.id]);

  useEffect(() => {
    checkPlantsInUse();
  }, [device]);

  const handlePlantSelect = (slot) => {
    setPlantToChange(slot);
    setModal(true);
  };

  const handlePlantChange = (plantId) => {
    setDevice((prev) => {
      const newDevice = { ...prev };
      for (let i = 1; i <= 4; i++) {
        if (newDevice[`plant_${i}`] === plantId) {
          newDevice[`plant_${i}`] = null;
        }
      }
      newDevice[`plant_${plantToChange}`] = plantId;
      return newDevice;
    });
    setPlantToChange(null);
    setModal(false);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  const handleNameChange = (e) => {
    setDevice((prev) => {
      const newDevice = { ...prev };
      newDevice[`device_name`] = e.target.value;
      return newDevice;
    });
  };

  const handleLocationChange = (e) => {
    setDevice((prev) => {
      const newDevice = { ...prev };
      newDevice[`location`] = e.target.value;
      return newDevice;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await modifyDevice(device)
      .then((res) => {
        toast.success("Device updated");
        router.replace(`/devices`);
      })
      .catch((err) => {
        toast.error("Couldn't update device");
      });
  };

  return (
    device && (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              <span className="font-bold">{device[`device_name`]}</span>{" "}
              configuration</p>
            <button
              className="hover:bg-green-500 bg-green-500/50 transition-all flex items-center justify-center rounded-full px-3 py-1 font-medium hover:text-black"
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
              Save
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
                value={device[`device_name`]}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex gap-3 items-center">
              <label htmlFor="location" className="text-gray-300 ps-3">
                Location
              </label>
              <input
                type="text"
                className=" bg-slate-700/40 rounded-md px-3 py-1 text-md flex-1"
                name="location"
                id="location"
                value={device[`location`]}
                onChange={handleLocationChange}
              />
            </div>
          </Card>
          <div className="flex flex-col">
            <p className="text-lg font-bold mb-4 relative">Sockets</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill()
                .map((plant, i) => (
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
                              (p) => p.plant_id === device[`plant_${i + 1}`]
                            )?.image
                          }) center center / cover no-repeat`,
                        }}
                      ></div>
                      <div className="flex flex-col items-center justify-center text-white my-4">
                        <p className="text-lg font-bold">
                          {plants.find(
                            (p) => p.plant_id === device[`plant_${i + 1}`]
                          )?.plant_name || "Empty socket"}
                        </p>
                        <p className="text-sm">
                          {plants.find(
                            (p) => p.plant_id === device[`plant_${i + 1}`]
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
    )
  );
};

const Frame = ({ children, title }) => {
  const [frameExpanded, setFrameExpanded] = useState([false]);

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

export default DeviceSettings;
