"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RocketIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import {
  faCheckCircle,
  faCrosshairs,
  faPenToSquare,
  faPlay,
  faRotateRight,
  faSpinner,
  faSquareArrowUpRight,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { Title, TitleContent, TitleOption } from "@/components/Title";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { modifyDevice } from "@/app/_actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WebSocketContext } from "@/lib/MessageContext";
import { Switch } from "@/components/ui/switch";
import { useWsStore } from "@/store/zustand";

const DeviceSettings = ({ plants, devices, params }) => {
  const router = useRouter();
  const [plantsInUse, setPlantsInUse] = useState({});
  const [device, setDevice] = useState(null);
  const [plantToChange, setPlantToChange] = useState(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const { sendCommand, calibrationMessage } = useContext(WebSocketContext);
  const temperatureMessage = useWsStore((s) => s.temperature);

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
    if (calibrationMessage) {
      if (
        parseInt(calibrationMessage.values.split("|")[0]) > 200 ||
        parseInt(calibrationMessage.values.split("|")[1]) > 200
      ) {
        setDevice((prev) => {
          const newDevice = { ...prev };
          newDevice[`sensor_config_${calibrationMessage.socket}`] =
            calibrationMessage.values;
          return newDevice;
        });
        toast.success("Calibration successful");
      } else {
        toast.error(
          "Calibration failed. The sensor is either not connected or broken."
        );
      }
    }
    console.log(calibrationMessage);
  }, [calibrationMessage]);

  
  useEffect(() => {
    // decoding the WS message and updating the readings
    if (temperatureMessage === null) return;
    const plant_id = temperatureMessage.plant_id;
    const temperature_value = Buffer.from(
      temperatureMessage.temperature_value,
      "base64"
    ).toString();
    device.temperature = temperature_value;
  }, [temperatureMessage]);

  useEffect(() => {
    devices.forEach((dev) => {
      if (dev.device_id == params.id) {
        console.log(device);
        setDevice(dev);
      }
    });
  }, [devices, params.id]);

  useEffect(() => {
    checkPlantsInUse();
    console.log(device);
  }, [device]);

  const handlePlantSelect = (slot) => {
    setPlantToChange(slot);
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

  const handleSensorConfigChange = (e, type, i) => {
    let sensorConfig = device[`sensor_config_${i}`].split("|");
    sensorConfig[type] = e.target.value;
    sensorConfig = sensorConfig.join("|");
    setDevice((prev) => {
      const newDevice = { ...prev };
      newDevice[`sensor_config_${i}`] = sensorConfig;
      return newDevice;
    });
  };

  const handleSubmit = async () => {
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
        {!device.configured ? (
          <Alert className="border-green-300 mb-4">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle className="text-green-300 font-bold">
              Configure this device!
            </AlertTitle>
            <AlertDescription>
              This device is yet to be configured.
              <br />
              Select a catchy name and add some devices to see your garden
              bloom!
            </AlertDescription>
          </Alert>
        ) : null}
        <Title>
          <TitleContent>
            <span className="text-lg md:text-3xl">{device["device_name"]}</span>
            <p className="text-sm text-gray-400">{device?.mac}</p>
          </TitleContent>
          <TitleOption>
            <Button onClick={handleSubmit}>
              <FontAwesomeIcon icon={faCheckCircle} className="pr-2" />
              <span className="hidden md:block">Save</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <FontAwesomeIcon icon={faPenToSquare} className="pr-2" />
                  <span className="hidden md:block">Edit plant</span>
                </Button>
              </SheetTrigger>
              <RenderDeviceSheet
                device={device}
                handleNameChange={handleNameChange}
                handleLocationChange={handleLocationChange}
                sendCommand={sendCommand}
              />
            </Sheet>
          </TitleOption>
        </Title>
        <Card
          className={
            "flex flex-col p-24 justify-center items-center font-medium relative"
          }
        >
          <p className="text-lg mb-0">{device["device_name"]}</p>
          <p className="text-sm">Located in {device["location"]}</p>
          {Object.values(device).some(value => value === "temperature") && device.temperature != null && (
            <div className="absolute top-3 right-3">
              <span className="text-gray-500">Temperature:{" "}</span>{device.temperature}°C
            </div>
          )}
        </Card>

        <div className="grid grid-rows-4 md:grid-cols-4 md:grid-rows-1 gap-3 !mt-0 ">
          {Array(4)
            .fill()
            .map((_, i) => {
              const plant = plants.find(
                (p) => p.plant_id === device[`plant_${i + 1}`]
              );
              const plantImage = plant?.image;
              const plantName = plant?.plant_name || "Empty socket";
              const plantSpecies = plant?.species || "Select a plant";

              return (
                <div className="flex flex-col items-center" key={i}>
                  <div className="h-20 w-5 border-l-2 border-r-2 relative bg-neutral-900 flex items-center">
                    <p className="absolute -top-14 text-xs text-gray-400 left-0 right-0 flex flex-col justify-center items-center gap-2 w-full whitespace-nowrap">
                      Slot {i + 1}{" "}

                      {i >= 2 && (
                        <div className="flex items-center space-x-1">
                          <Switch
                            id={`switch-${i + 1}`}
                            checked={
                              device[`sensor_type_${i + 1}`] == "temperature"
                            }
                            onCheckedChange={(checked) => {
                              setDevice((prev) => {
                                const newDevice = { ...prev };
                                if (checked) {
                                  // If the user is trying to enable temperature sensor, disable all other sensors
                                  for (let j = 1; j <= 4; j++) {
                                    if (j !== i + 1) {
                                      newDevice[`sensor_type_${j}`] = "soil";
                                    }
                                  }
                                }
                                newDevice[`sensor_type_${i + 1}`] = checked ? "temperature" : "soil";
                                return newDevice;
                              });
                            }}
                          />
                          <Label
                            htmlFor={`switch-${i + 1}`}
                            className="text-xs text-gray-400"
                          >
                            Temperature
                          </Label>
                        </div>
                      )}
                    </p>
                  </div>

                  {device[`sensor_type_${i + 1}`] == "soil" ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card
                            className="flex flex-col w-full h-32 items-center justify-center rounded-md relative overflow-hidden cursor-pointer isolate"
                            variant="outline"
                            onClick={() => handlePlantSelect(i + 1)}
                          >
                            {plantName !== "Empty socket" && (
                              <Link
                                href={`/plants/${plant?.plant_id}`}
                                className="absolute top-2 right-2"
                              >
                                <Button className="p-3">
                                  <FontAwesomeIcon
                                    icon={faSquareArrowUpRight}
                                  />
                                </Button>
                              </Link>
                            )}
                            {plantImage && (
                              <div
                                className="w-full h-full top-0 left-0 absolute -z-10 after:w-full after:h-full after:bg-black/40 after:absolute after:top-0 after:left-0"
                                style={{
                                  background: `url(http://leafbox.ddns.net:5000/uploads/${plantImage}) center center / cover no-repeat`,
                                }}
                              ></div>
                            )}
                            <div
                              className={`flex flex-col items-center justify-center ${
                                plantName !== "Empty socket"
                                  ? "text-white"
                                  : "text-gray-400"
                              } my-4`}
                            >
                              <p className="text-lg font-bold ">{plantName}</p>
                              <p className="text-sm">{plantSpecies}</p>
                            </div>
                          </Card>
                        </DialogTrigger>
                        <RenderPlantModal
                          plants={plants}
                          i={i}
                          handlePlantChange={handlePlantChange}
                          plantsInUse={plantsInUse}
                          deviceId={device.device_id}
                          showOnlyAvailable={showOnlyAvailable}
                          setShowOnlyAvailable={setShowOnlyAvailable}
                        />
                      </Dialog>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Sensor config</AccordionTrigger>
                          <AccordionContent>
                            <Label htmlFor="moistureMin" className="text-sm">
                              0% analog value
                            </Label>
                            <Input
                              type="number"
                              placeholder="1500"
                              value={
                                device[`sensor_config_${i + 1}`].split("|")[0]
                              }
                              onChange={(e) =>
                                handleSensorConfigChange(e, 0, i + 1)
                              }
                            />
                            <Label
                              htmlFor="moistureMin"
                              className="text-sm mt-3"
                            >
                              100% analog value
                            </Label>
                            <Input
                              type="number"
                              placeholder="1000"
                              value={
                                device[`sensor_config_${i + 1}`].split("|")[1]
                              }
                              onChange={(e) =>
                                handleSensorConfigChange(e, 1, i + 1)
                              }
                            />
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="mt-3">
                                  <FontAwesomeIcon
                                    icon={faCrosshairs}
                                    className="pr-2"
                                  />
                                  <span className="hidden md:block">
                                    Calibrate
                                  </span>
                                </Button>
                              </DialogTrigger>
                              <RenderCalibrationModal
                                device={device}
                                socket={i + 1}
                                sendCommand={sendCommand}
                              />
                            </Dialog>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </>
                  ) : (
                    <Card className="h-full w-full flex justify-center items-center border-blue-300 border-dotted flex-col">
                      <p className="font-bold">Temperature sensor</p>
                    </Card>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    )
  );
};

const RenderCalibrationModal = ({ device, socket, sendCommand }) => {
  const [step, setStep] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const handleClick = () => {
    setIsMeasuring(true);
    sendCommand(device.mac, "calibrate", { step: step, plant: socket });

    setTimeout(() => {
      setStep((prev) => prev + 1);
      setIsMeasuring(false);
    }, 2000);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Calibrate sensor connected to socket {socket}</DialogTitle>
      </DialogHeader>
      {step === 0 && (
        <div className="">
          <p className="text-sm text-red-400">
            Please note that the device will be paused during the calibration
            process. Ensure that the device is properly configured and running.
            If you choose to abort the calibration, the device will resume its
            normal operation within 1 minute.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setStep(1)} className="mt-3">
              <FontAwesomeIcon icon={faPlay} className="pr-2" />
              <span>Start calibration</span>
            </Button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="">
          <p className="text-2xl">Step {step}</p>
          <p>Place the sensor in the dried out soil and click next.</p>
          <p className="text-xs">
            Make sure that the device is configured and running.
          </p>
          <div className="flex justify-end">
            {!isMeasuring ? (
              <Button onClick={() => handleClick()} className="mt-3">
                Next
              </Button>
            ) : (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="">
          <p className="text-2xl">Step {step}</p>
          <p>Great! Now place the sensor in the water and click next.</p>
          <p className="text-xs">
            Now place the sensor in the water and click next.
          </p>
          <div className="flex justify-end">
            {!isMeasuring ? (
              <Button onClick={() => handleClick()} className="mt-3">
                Next
              </Button>
            ) : (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="">
          <p className="text-2xl">Step {step}</p>
          <p>All set! The updated values are applied to the device</p>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  handleClick();
                  setStep(0);
                }}
                className="mt-3 bg-green-600 text-white hover:bg-green-700"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      )}
    </DialogContent>
  );
};

const RenderDeviceSheet = ({
  device,
  handleNameChange,
  handleLocationChange,
  sendCommand,
}) => {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const handleRestart = (e) => {
    setButtonsDisabled(true);
    sendCommand(device?.mac, "reboot");

    toast.promise(new Promise((resolve) => setTimeout(resolve, 10000)), {
      loading: `Restarting ${device?.device_name}`,
      success: `${device?.device_name} restarted!`,
    });

    setTimeout(() => {
      setButtonsDisabled(false);
    }, 10000);
  };
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit the plant</SheetTitle>
        <SheetDescription>
          You can edit the plant's properties here.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            className="col-span-3"
            defaultValue={device?.device_name}
            onChange={(e) => handleNameChange(e)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Location
          </Label>
          <Input
            id="species"
            className="col-span-3"
            defaultValue={device?.location}
            onChange={(e) => handleLocationChange(e)}
          />
        </div>
      </div>
      <Button
        variant="destructive"
        {...(buttonsDisabled ? { disabled: true } : {})}
        onClick={() => handleRestart()}
      >
        <FontAwesomeIcon icon={faRotateRight} className="pr-2" />
        <span className="hidden md:block">Restart device</span>
      </Button>

      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

const RenderPlantModal = ({
  plants,
  i,
  handlePlantChange,
  plantsInUse,
  deviceId,
  showOnlyAvailable,
  setShowOnlyAvailable,
}) => {
  return (
    <DialogContent className="sm:max-w-6xl">
      <DialogHeader>
        <DialogTitle>Connect a plant</DialogTitle>
        <DialogDescription>
          Select a plant to connect to Socket {i + 1}.
        </DialogDescription>
      </DialogHeader>
      <div className="flex gap-2 items-center">
        <Checkbox
          onCheckedChange={(checked) => setShowOnlyAvailable(checked)}
          checked={showOnlyAvailable}
          id="available"
        />
        <label
          htmlFor="available"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show only available
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {plants.map((plant, j) => {
          const isPlantInUseByAnotherDevice =
            plantsInUse[plant.plant_id] &&
            plantsInUse[plant.plant_id].deviceId !== deviceId;

          if (showOnlyAvailable && isPlantInUseByAnotherDevice) return null;
          return (
            <DialogClose asChild key={plant.plant_id}>
              <Card
                onClick={() => {
                  if (!isPlantInUseByAnotherDevice) {
                    handlePlantChange(plant.plant_id);
                  } else {
                    toast.error(
                      `${plant.plant_name} is already in use by ${
                        plantsInUse[plant.plant_id]?.deviceName
                      }`
                    );
                  }
                }}
                className={cn(
                  "text-white w-full p-3 relative rounded-lg shadow isolate overflow-hidden flex cursor-pointer gap-3",
                  { "text-red-400 border-red-400": isPlantInUseByAnotherDevice }
                )}
              >
                <div
                  className={`h-10 w-10 rounded ${
                    !plant.image ? "hidden" : null
                  }`}
                  style={{
                    background: `url(http://leafbox.ddns.net:5000/uploads/${plant?.image}) center center / cover no-repeat`,
                  }}
                ></div>
                <div className="flex justify-center flex-col">
                  <p className="text-xl leading-5">{plant?.plant_name}</p>
                  {isPlantInUseByAnotherDevice && (
                    <p className="text-xs">
                      Used by {plantsInUse[plant.plant_id]?.deviceName}
                    </p>
                  )}
                </div>
              </Card>
            </DialogClose>
          );
        })}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={() => handlePlantChange(null)}
            variant="secondary"
            className="mr-auto"
          >
            Clear socket
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeviceSettings;
