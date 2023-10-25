"use client";
import { useWsStore } from "@/store/zustand";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faImages,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import PlantDetails from "./PlantDetails";
import { Checkbox } from "@/components/ui/checkbox";
import { deletePlant, modifyPlant, uploadImage } from "@/app/_actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { prepareChartData } from "@/lib/utils";

const PlantID = ({
  plant_res,
  readings_res,
  params,
  readingsAmmount,
}) => {
  const [chartData, setChartData] = useState(null);
  const [plant, setPlant] = useState(null);
  const [readings, setReadings] = useState(null);
  const [editingDesc, setEditingDesc] = useState(false);
  const [image, setImage] = useState(null);
  const message = useWsStore((s) => s.moisture);

  useEffect(() => {
    setPlant(plant_res);
    setReadings(readings_res);
  }, [plant_res, readings_res]);

  useEffect(() => {
    console.log(plant);
  }, [plant]);

  const updatePlant = async (newPlant) => {
    await modifyPlant(newPlant)
      .then((res) => {
        if (res.code === 200) {
          toast.success("Plant updated successfully");
        } else {
          toast.error("Error updating plant");
        }
      })
      .catch((err) => {
        toast.error("Unknown error");
        toast.error("Error updating plant");
      });
  };

  const updateImage = async () => {
    const formData = new FormData();
    formData.append("image", image);
    const res = await uploadImage(formData);
    if (res.status === 200) {
      toast.success("Image uploaded");
      const newPlant = { ...plant };
      newPlant.image = res.data.image;
      newPlant.color = res.data.color;
      setPlant(newPlant);
      updatePlant(newPlant);
    } else {
      toast.error("Couldn't upload image");
    }
  };

  const removeImage = async () => {
    const newPlant = { ...plant };
    newPlant.image = "";
    newPlant.color = "#7f7f7f";
    setPlant(newPlant);
    updatePlant(newPlant);
  };

  useEffect(() => {
    if (image === null) return;
    updateImage();
  }, [image]);

  useEffect(() => {
    if (!readings) return;
    setChartData(prepareChartData(readings));
  }, [readings]);

  useEffect(() => {
    if (message === null) return;
    const plant_id = message.plant_id;
    const moisture_value = Buffer.from(
      message.moisture_value,
      "base64"
    ).toString();
    const timestamp = moment(message.timestamp).subtract(2, "hours").format();
    if (plant_id === params.id) {
      setReadings((prev) => {
        if (prev && typeof prev[Symbol.iterator] === "function") {
          const newReadings = [...prev];
          newReadings.unshift({ moisture_value, timestamp });
          if (newReadings.length > readingsAmmount) newReadings.pop();
          return newReadings;
        }
        return [];
      });
    }
  }, [message]);

  return (
    plant &&
    readings && (
      <>
        <div
          className="absolute top-0 left-0 h-full w-full -z-20 opacity-20"
          style={{
            background: `radial-gradient(circle at top, ${plant.color} 0%, transparent 50%)`,
          }}
        ></div>
        <div className="h-full w-full flex flex-col md:grid md:grid-rows-[auto,1fr] gap-3">
          <div id="id_top">
            <Title>
              <TitleContent className={"flex gap-3 items-center"}>
                <div
                  className={`h-12 md:h-24 aspect-square rounded transition-all ease duration-200 relative group ${
                    !plant?.image ? "border-2 border-dashed" : "border-none"
                  }`}
                  style={
                    plant?.image
                      ? {
                          background: `url(${process.env.NEXT_PUBLIC_API_HOST}/image/${plant?.image}) no-repeat center center/cover`,
                        }
                      : null
                  }
                >
                  <div className="absolute opacity-0 transition-all group-hover:opacity-100 bottom-1 left-0 w-full flex justify-between text-sm px-1">
                    <Label
                      htmlFor="image"
                      className=" bg-white rounded text-black center flex items-center cursor-pointer"
                    >
                      <Input
                        id="image"
                        type="file"
                        className="hidden"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => setImage(e.target.files?.[0])}
                      />
                      <FontAwesomeIcon icon={faImages} className="p-1" />
                    </Label>
                    {plant?.image && (
                      <div className="cursor-pointer" onClick={removeImage}>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="p-1 bg-red-500 rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="">
                  <p className="m-0">{plant?.plant_name}</p>
                  {plant?.species && (
                    <p className="text-xs text-gray-400 italic">
                      {plant?.species}
                    </p>
                  )}
                  {plant?.device_name && (
                    <Link
                      href={`/devices/${plant?.device_id}`}
                      className="text-xs text-gray-400 font-normal"
                    >
                      Bound to{" "}
                      <span className="italic font-bold">
                        {plant?.device_name} slot {plant?.slot}
                      </span>
                    </Link>
                  )}
                </div>
              </TitleContent>
              <TitleOption>
                <Sheet>
                  <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-3">
                    <FontAwesomeIcon icon={faPenToSquare} className="md:pr-2" />
                    <span className="hidden md:block">Edit plant</span>
                  </SheetTrigger>
                  <EditModal
                    plant={plant}
                    updatePlant={updatePlant}
                    setPlant={setPlant}
                  />
                </Sheet>
              </TitleOption>
            </Title>
          </div>

          <PlantDetails
            plant={plant}
            readings={readings}
            chartData={chartData}
            editingDesc={editingDesc}
            setEditingDesc={setEditingDesc}
            updatePlant={updatePlant}
          />
        </div>
      </>
    )
  );
};

const EditModal = ({ plant, updatePlant, setPlant }) => {
  const router = useRouter();

  const editPlant = async (e) => {
    e.preventDefault();
    const newPlant = { ...plant };
    newPlant.plant_name = e.target.name.value;
    newPlant.species = e.target.species.value;
    newPlant.lower_threshold = e.target.lower_threshold.value;
    newPlant.upper_threshold = e.target.upper_threshold.value;
    await updatePlant(newPlant);
    setPlant(newPlant);
  };

  const handleDeletePlant = async () => {
    try {
      const res = await deletePlant(plant);
      console.log(res);
      if (res.status === 200) {
        toast.success("Plant deleted successfully");
        router.push("/plants");
      } else {
        toast.error("Error deleting plant");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unknown error");
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit the plant</SheetTitle>
        <SheetDescription>
          You can edit the plant's properties here.
        </SheetDescription>
      </SheetHeader>
      <form onSubmit={editPlant}>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              defaultValue={plant?.plant_name}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="species" className="text-right">
              Species
            </Label>
            <Input
              id="species"
              defaultValue={plant?.species}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-right">Device</p>
            <Link
              href={`/devices/${plant.device_id ? plant?.device_id : ""}`}
              className="col-span-3"
            >
              <Button className="w-full">
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className="pr-2"
                />
                {plant?.device_name ? (
                  <>
                    {plant?.device_name} slot {plant?.slot}
                  </>
                ) : (
                  "Assign a device"
                )}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center mt-4">
            <Label htmlFor="lower_threshold" className="col-span-3">
              Minimum moisture (%) <span className="text-red-400">*</span>
            </Label>
            <Input
              id="lower_threshold"
              name="lower_threshold"
              min={0}
              max={100}
              defaultValue={plant?.lower_threshold}
            />
          </div>
          <Slider
            defaultValue={[plant.lower_threshold]}
            min={0}
            max={100}
            step={1}
          />
          <div className="grid grid-cols-4 gap-4 items-center mt-4">
            <Label htmlFor="upper_threshold" className="col-span-3">
              Maximum moisture (%) <span className="text-red-400">*</span>
            </Label>
            <Input
              id="upper_threshold"
              name="upper_threshold"
              min={0}
              max={100}
              defaultValue={plant?.upper_threshold}
            />
          </div>
          <Slider
            defaultValue={[plant.upper_threshold]}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete plant</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {!plant?.device_name ? (
              <>
                <DialogHeader>
                  <DialogTitle className={"text-red-500 font-bold"}>
                    Warning!
                  </DialogTitle>
                  <DialogDescription>
                    This is a destructive action. All the readings for the plant
                    will be gone forever.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-3">
                  <Checkbox id="sure"></Checkbox>
                  <Label htmlFor="sure">
                    I'm absolutely sure i want to delete this plant!
                  </Label>
                </div>
                <DialogFooter>
                  <Button variant="destructive" onClick={handleDeletePlant}>
                    Delete the plant forever.
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Hold up, not so fast!</DialogTitle>
                  <DialogDescription>
                    You can't delete a plant that is bound to a device. Please
                    clear the socket first.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Link href={`/devices/${plant?.device_id}`}>
                    <Button>
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="pr-2"
                      />
                      Device settings
                    </Button>
                  </Link>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  );
};

export default PlantID;
