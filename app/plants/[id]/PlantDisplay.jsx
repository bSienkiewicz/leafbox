"use client";
import { useWsStore } from "@/store/zustand";
import moment from "moment-timezone";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import Chart from "@/components/ChartComponent";
import { putPlant } from "@/lib/db";
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
  faICursor,
  faLinkSlash,
  faPenToSquare,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const PlantDisplay = ({
  plant_res,
  readings_res,
  loading_res,
  modifyPlant,
  params,
}) => {
  const [chartData, setChartData] = useState(null);
  const [plant, setPlant] = useState(null);
  const [readings, setReadings] = useState(null);
  const [editingDesc, setEditingDesc] = useState(false);
  const [loading, setLoading] = useState(null);
  const message = useWsStore((s) => s.moisture);
  let readingsAmmount = 25;

  useEffect(() => {
    setPlant(plant_res);
    setReadings(readings_res);
    setLoading(loading_res);
  }, [plant_res, readings_res, loading_res]);

  const handleInputChange = (event, type) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: event.target.value,
    }));
  };

  const handleThresholdInput = (event, type) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: parseInt(event.target.value),
    }));
  };

  const updatePlant = async () => {
    await modifyPlant(plant)
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

  useEffect(() => {
    if (readings === null) return;
    const labels = readings
      ?.map((reading) => moment(reading.timestamp).format("HH:mm"))
      .reverse();
    const moistureValues = readings
      ?.map((reading) => reading.moisture_value)
      .reverse();
    const data = {
      labels: labels,
      datasets: [
        {
          data: moistureValues,
        },
      ],
    };
    setChartData(data);
  }, [readings]);

  useEffect(() => {
    if (message === null) return;
    const plant_id = message.plant_id;
    const moisture_value = Buffer.from(
      message.moisture_value,
      "base64"
    ).toString();
    const timestamp = message.timestamp;
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
    readings &&
    !loading && (
      <div className="h-full w-full flex flex-col md:grid md:grid-rows-[auto,1fr] gap-3">
        {/* <Card cClass="w-full relative items-center text-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex gap-3 items-center">
              <div
                className="h-12 md:h-24 aspect-square rounded transition-all ease duration-200"
                style={
                  plant?.image
                    ? {
                        background: `url(${plant?.image}) no-repeat center center/cover`,
                      }
                    : {
                        background: `url(/placeholder.webp) no-repeat center center/cover`,
                      }
                }
              ></div>
              <div className="">
                {plant?.device_name ? (
                  <Link
                    href={`/devices?mark=${plant?.device_name}`}
                    className="text-sm text-gray-300 font-bold"
                  >
                    {plant?.device_name} slot {plant?.slot}
                  </Link>
                ) : (
                  <p className="text-sm text-red-300 font-bold">
                    Not connected to any device
                  </p>
                )}
                <input
                  className="text-4xl font-bold bg-transparent transition-all focus:bg-black/20 w-full"
                  value={plant?.plant_name}
                  onChange={(e) => handleInputChange(e, "plant_name")}
                  onBlur={updatePlant}
                />
                <input
                  className="text-sm italic bg-transparent transition-all focus:bg-black/20"
                  value={plant?.species}
                  onChange={(e) => handleInputChange(e, "species")}
                  onBlur={updatePlant}
                />
              </div>
            </div>
            {readings?.length > 0 && (
              <div className="ml-auto lg:flex gap-5 hidden">
                <div className="">
                  <p className="text-lg">Last watering</p>
                  <p className="text-2xl font-bold">
                    {moment
                      .utc(readings?.[0]?.timestamp)
                      .utcOffset(-120, true)
                      .fromNow()}
                  </p>
                </div>
                <div className="">
                  <p className="text-lg">Moisture</p>
                  <p className="text-2xl font-bold">
                    {readings?.[0]?.moisture_value}%
                  </p>
                </div>
              </div>
            )}
          </div>
          <div
            className="absolute h-1 bg-blue-400 left-0 bottom-0 w-0 transition-all duration-1000 ease-out"
            style={{ width: `${readings?.[0]?.moisture_value}%` }}
          ></div>
        </Card> */}

        {/* <div className="flex flex-col gap-2">
          <span htmlFor="desc" className="font-medium">
            Description
          </span>
          <textarea
            name="desc"
            id="desc"
            rows={3}
            className="w-full rounded-lg backdrop-blur-sm bg-neutral-700/20 shadow-spot backdrop-saturate-200 resize-none p-3 text-gray-300 text-sm"
            placeholder="Enter a description for this plant"
            value={plant?.description}
            onBlur={updatePlant}
            onInput={(e) => handleInputChange(e, "description")}
          ></textarea>
        </div> */}
        <div className="">
          <Title>
            <TitleContent className={"flex gap-3 items-center"}>
              <div
                className="h-12 md:h-24 aspect-square rounded transition-all ease duration-200"
                style={
                  plant?.image
                    ? {
                        background: `url(${plant?.image}) no-repeat center center/cover`,
                      }
                    : {
                        background: `url(/placeholder.webp) no-repeat center center/cover`,
                      }
                }
              ></div>
              {plant?.plant_name}
            </TitleContent>
            <TitleOption>
              <Sheet>
                <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-3">
                  <FontAwesomeIcon icon={faPenToSquare} className="pr-2" />
                  Edit plant
                </SheetTrigger>
                <EditModal
                  plant={plant}
                  handleThresholdInput={handleThresholdInput}
                />
              </Sheet>
            </TitleOption>
          </Title>

          <div className="grid grid-cols-3 gap-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Last watering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {moment
                    .utc(readings?.[0]?.timestamp)
                    .utcOffset(-120, true)
                    .fromNow()}
                </p>
                <p className="text-sm text-gray-400">
                  {moment
                    .utc(readings?.[0]?.timestamp)
                    .utcOffset(-120, true)
                    .format("HH:mm DD/MM/YY")}
                </p>
              </CardContent>
            </Card>
            <div className="col-span-2 relative">
              <Badge
                className={cn(
                  "absolute bottom-2 right-2",
                  !editingDesc ? "animate-pop-up" : "animate-pop-down"
                )}
              >
                <FontAwesomeIcon icon={faICursor} className="pr-2" />
                Edit the description
              </Badge>
              <Textarea
                className="h-full w-full resize-none rounded-lg border-2 animate-pop-up-longer"
                placeholder="Your plant description goes here..."
                defaultValue={plant?.description}
                onFocus={() => setEditingDesc(true)}
                onBlur={() => {
                  updatePlant();
                  setEditingDesc(false);
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-rows-1 grid-cols-7 gap-3 h-full">
          <div className="LEFT relative col-span-5">
            <Card className="h-full p-6 box-border">
              {plant?.device_name && (
                <div className="absolute top-3 right-3 rounded-full bg-black/20 backdrop-blur-lg px-2 py-1 text-white text-xs flex items-center gap-1 pointer-events-none z-30">
                  <div className="relative h-3 w-3">
                    <span
                      className={`animate-ping absolute rounded-full bg-blue-300 w-full h-full inline-flex opacity-70 dur`}
                    ></span>
                    <span
                      className={`absolute rounded-full bg-blue-300 w-full h-full inline-flex`}
                    ></span>
                  </div>
                  <p>LIVE</p>
                </div>
              )}
              {chartData && (
                <Chart
                  data={chartData}
                  min={plant?.lower_threshold}
                  max={plant?.upper_threshold}
                />
              )}
            </Card>
          </div>
          <div className="RIGHT col-span-2 flex flex-col h-full gap-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="">
                  <CardTitle>Moisture</CardTitle>
                  <CardDescription>Last reading</CardDescription>
                </div>
                <p className="text-2xl font-bold">
                  {readings?.[0]?.moisture_value}%
                </p>
              </CardHeader>
            </Card>
            <Card className="flex-1 h-full">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button>Manual watering</Button>
                <Button disabled>Calibration</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  );
};

const EditModal = ({ plant, handleThresholdInput }) => {
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
            defaultValue={plant?.plant_name}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Species
          </Label>
          <Input
            id="species"
            defaultValue={plant?.species}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Device
          </Label>
          <Button className="col-span-3">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="pr-2" />
            Setup in devices
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 items-center mt-4">
          <Label htmlFor="username" className="col-span-3">
            Minimum moisture (%) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="moistureMin"
            min={0}
            max={100}
            defaultValue={plant?.lower_threshold}
            onChange={(e) => handleThresholdInput(e, "lower_threshold")}
          />
        </div>
        <Slider
          defaultValue={[plant.lower_threshold]}
          min={0}
          max={100}
          step={1}
          onChange={(value) => handleThresholdInput(value, "lower_threshold")}
        />
        <div className="grid grid-cols-4 gap-4 items-center mt-4">
          <Label htmlFor="username" className="col-span-3">
            Maximum moisture (%) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="moistureMin"
            min={0}
            max={100}
            defaultValue={plant?.upper_threshold}
            onChange={(e) => handleThresholdInput(e, "upper_threshold")}
          />
        </div>
        <Slider
          defaultValue={[plant.upper_threshold]}
          min={0}
          max={100}
          step={1}
          onChange={(value) => handleThresholdInput(value, "upper_threshold")}
        />
        <div className="grid grid-cols-4 gap-4 items-center mt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="username" className="col-span-3">
                Minimum temperature (°C) <FontAwesomeIcon icon={faQuestionCircle} className="pl-2" />
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>Optional field. Set to empty to ignore the temperature setting for this plant.</p>
            </TooltipContent>
          </Tooltip>
          <Input
            id="moistureMin"
            min={0}
            max={100}
            defaultValue={plant?.upper_threshold}
            onChange={(e) => handleThresholdInput(e, "upper_threshold")}
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

export default PlantDisplay;
