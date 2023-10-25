"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RocketIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import {
  faCheckCircle,
  faPenToSquare,
  faPlay,
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

const DeviceSettings = ({ plants, devices, params }) => {
  const router = useRouter();
  const [plantsInUse, setPlantsInUse] = useState({});
  const [device, setDevice] = useState(null);
  const [plantToChange, setPlantToChange] = useState(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [popversOpen, setPopoversOpen] = React.useState([
    false,
    false,
    false,
    false,
  ]);
  const [value, setValue] = React.useState("");
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

    console.log(plantsInUse);

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
          <Alert className="border-green-300 ">
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
          <TitleContent>{device["device_name"]}</TitleContent>
          <TitleOption>
            <Button onClick={handleSubmit}>
              <FontAwesomeIcon icon={faCheckCircle} className="pr-2" />
              Save
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <FontAwesomeIcon icon={faPenToSquare} className="pr-2" />
                  Edit plant
                </Button>
              </SheetTrigger>
              <RenderDeviceSheet
                device={device}
                handleNameChange={handleNameChange}
                handleLocationChange={handleLocationChange}
              />
            </Sheet>
          </TitleOption>
        </Title>
        <Card
          className={
            "flex flex-col p-24 justify-center items-center font-medium"
          }
        >
          <p className="text-lg mb-0">{device["device_name"]}</p>
          <p className="text-sm">Located in {device["location"]}</p>
        </Card>

        <div className="grid grid-cols-4 gap-3 !mt-0">
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
                  <div className="h-20 w-5 border-l-2 border-r-2 relative bg-neutral-900">
                    <p className="absolute -top-6 text-xs text-gray-400 left-0 right-0 flex justify-center w-full whitespace-nowrap">
                      Slot {i + 1}
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Card
                        className="flex flex-col w-full h-32 items-center justify-center rounded-md relative overflow-hidden cursor-pointer isolate"
                        variant="outline"
                        onClick={() => handlePlantSelect(i + 1)}
                      >
                        {plantName !== "Empty socket" && (
                          <Link href={`/plants/${plant?.plant_id}`} className="absolute top-2 right-2">
                            <Button className="p-3">
                              <FontAwesomeIcon icon={faSquareArrowUpRight} />
                            </Button>
                          </Link>
                        )}
                        {plantImage && (
                          <div
                            className="w-full h-full top-0 left-0 absolute -z-10 after:w-full after:h-full after:bg-black/40 after:absolute after:top-0 after:left-0"
                            style={{
                              background: `url(${process.env.NEXT_PUBLIC_API_HOST}/image/${plantImage}) center center / cover no-repeat`,
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
                </div>
              );
            })}
        </div>
        {/* <div className="flex flex-col">
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
        )} */}
        {/* <div className="absolute bottom-0 left-0 w-full h-3/4 bg-red-300 z-20 translate-y-3/4 hover:translate-y-0"></div> */}
      </div>
    )
  );
};

const RenderDeviceSheet = ({
  device,
  handleNameChange,
  handleLocationChange,
}) => {
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
                    background: `url(${process.env.NEXT_PUBLIC_API_HOST}/image/${plant?.image}) center center / cover no-repeat`,
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

// const RenderModal = ({
//   plants,
//   plantsInUse,
//   handleModalClose,
//   handlePlantChange,
// }) => {
//   return (
//     <Modal onClose={handleModalClose}>
//       <button
//         className="p-3 rounded-full text-md text-center border-2 w-full mb-4"
//         onClick={() => handlePlantChange(null)}
//       >
//         CLEAR
//       </button>
//       {plants.map((plant, i) => (
//         <div
//           onClick={() => handlePlantChange(plant.plant_id)}
//           className="text-white w-full h-16 p-3 relative rounded-lg shadow isolate overflow-hidden flex mb-4 cursor-pointer "
//           style={{
//             background: `url(${plant?.image}) center center / cover no-repeat`,
//           }}
//         >
//           <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm"></div>
//           <div className="flex justify-between items-center z-20">
//             <div className="flex gap-3 items-center">
//               <h1 className="text-2xl">{plant?.plant_name}</h1>
//               <p className="text-xs text-gray-400">{plant?.device_name}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </Modal>
//   );
// };

export default DeviceSettings;
