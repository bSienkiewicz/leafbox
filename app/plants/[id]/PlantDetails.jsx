"use client";
import Chart from "@/components/Charts/ChartComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { faICursor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/MessageContext";
import { Car } from "lucide-react";
import toast from "react-hot-toast";
import { useWsStore } from "@/store/zustand";

const PlantDetails = ({
  plant,
  readings,
  readingsChartData,
  editingDesc,
  setEditingDesc,
  updatePlant,
}) => {
  const { sendCommand } = useContext(WebSocketContext);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const temperatureMessage = useWsStore((s) => s.temperature);

  
  useEffect(() => {
    // decoding the WS message and updating the readings
    if (temperatureMessage === null) return;
    const temperature_value = Buffer.from(
      temperatureMessage.temperature_value,
      "base64"
    ).toString();
    setTemperature(temperature_value);
  }, [temperatureMessage]);

  const handleDescriptionChange = (event) => {
    const newPlant = { ...plant };
    newPlant.description = event.target.value;
    updatePlant(newPlant);
    setEditingDesc(false);
  };

  const handleClick = (command, cooldown) => {
    console.log(command);
    setButtonsDisabled(true);
    sendCommand(plant?.device_mac, command, {
      plant_id: plant?.plant_id,
    });

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, cooldown)),
      {
        loading: command.charAt(0).toUpperCase() + command.slice(1) + " in progress...",
        success: command.charAt(0).toUpperCase() + command.slice(1) + " done!",
      }
    );

    setTimeout(() => {
      setButtonsDisabled(false);
    }, cooldown);
  };

  return (
    <div className="flex flex-col md:grid grid-cols-7 grid-rows-[auto,1fr] h-full gap-3">
      <div className="col-span-7 flex gap-3 flex-col md:flex-row">
        <Card className="p-6 text-center">
          <div className="flex md:flex-col items-center md:items-start justify-between h-full gap-3">
            <CardTitle>Moisture</CardTitle>
            <p
              className="text-3xl font-bold"
              style={{ color: plant?.color }}
            >
              {readings?.[0]?.moisture_value}%
            </p>
          </div>
        </Card>
        {temperature && (
        <Card className="p-6 text-center">
          <div className="flex md:flex-col items-center md:items-start justify-between h-full gap-3">
            <CardTitle>Temperature</CardTitle>
            <p
              className="text-3xl font-bold"
              style={{ color: plant?.color }}
            >
              {parseFloat(temperature).toFixed(1)}ºC
            </p>
          </div>
        </Card>
        )}
        <div className="relative flex-1">
          <Badge
            className={cn(
              "absolute bottom-2 right-2",
              !editingDesc ? "animate-pop-up" : "animate-pop-down"
            )}
            style={{ background: plant?.color }}
          >
            <FontAwesomeIcon icon={faICursor} className="pr-2" />
            Edit the description
          </Badge>
          <Textarea
            className="h-full w-full resize-none rounded-lg border-2 animate-pop-up-longer"
            placeholder="Your plant description goes here..."
            defaultValue={plant?.description}
            rows={3}
            onFocus={() => setEditingDesc(true)}
            onBlur={(e) => handleDescriptionChange(e)}
          />
        </div>
      </div>
      <div className="LEFT relative col-span-5">
        <Card className="p-1 md:p-6 h-full">
          {plant?.device_name && (
            <div className="absolute top-3 right-3 rounded-full bg-black/20 backdrop-blur-lg px-2 py-1 text-white text-xs flex items-center gap-1 pointer-events-none z-30">
              <div className="relative h-3 w-3">
                <span
                  className={`animate-ping absolute rounded-full w-full h-full inline-flex opacity-70 dur`}
                  style={{ background: plant?.color }}
                ></span>
                <span
                  className={`absolute rounded-full w-full h-full inline-flex`}
                  style={{ background: plant?.color }}
                ></span>
              </div>
              <p>LIVE</p>
            </div>
          )}
          <div className="absolute bottom-1 right-5">
            <p className="text-gray-600 text-xs">
              Plant watering sheduled once every {plant?.reading_delay}{" "}
              {plant?.reading_delay_mult == 1 && "seconds"}{" "}
              {plant?.reading_delay_mult == 60 && "minutes"}{" "}
              {plant?.reading_delay_mult == 3600 && "hours"}
            </p>
          </div>
          {readingsChartData && (
            <Chart
              data={readingsChartData}
              options={chartOptions(
                plant?.lower_threshold,
                plant?.upper_threshold,
                plant?.color
              )}
            />
          )}
        </Card>
      </div>
      <div className="RIGHT col-span-2 flex flex-col gap-3">
        <Card className="">
          <CardHeader>
            <CardTitle>Last watering</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: plant?.color }}>
              {moment(readings?.[0]?.timestamp).add(1, "hours")
                // .utcOffset(-120, true)
                .fromNow()}
            </p>
            <p className="text-sm text-gray-400">
              {moment(readings?.[0]?.timestamp).add(1, "hours").format("HH:mm DD/MM/YY")}
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              {...(!plant?.device_name || buttonsDisabled
                ? { disabled: true }
                : {})}
              onClick={() =>
                handleClick("watering", 10000)
              }
            >
              Single watering
            </Button>
            <Button>Full watering</Button>
            <Button
              {...(!plant?.device_name || buttonsDisabled
                ? { disabled: true }
                : {})}
              onClick={() =>
                handleClick("reading", 1000)
              }
            >
              Force a reading
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const chartOptions = (min, max, color) => {
  return {
    maintainAspectRatio: false,
    aspectRatio: undefined,
    plugins: {
      legend: {
        display: false,
        titleFont: {
          size: 12,
          family: "Inter",
          weight: "bold",
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: min,
            yMax: min,
            borderColor: "rgb(255, 99, 132, 0.2)",
            borderWidth: 2,
            borderDash: [5, 5],
          },
          line2: {
            type: "line",
            yMin: max,
            yMax: max,
            borderColor: "rgba(96, 100, 250, 0.2)",
            borderWidth: 2,
            borderDash: [5, 5],
          },
        },
      },
      tooltip: {
        position: "nearest",
        caretSize: 0,
        bodyAlign: "center",
        xAlign: "center",
        yAlign: "center",
        displayColors: false,
        cornerRadius: 8,
        backgroundColor: "rgba(0,0,0,1)",
        padding: 8,
        borderWidth: 1,
        borderColor: "hsl(240 3.7% 15.9%)",
        callbacks: {
          title: function (tooltipItem, data) {
            return "";
          },
          label: function (tooltipItem, data) {
            return tooltipItem.formattedValue + "%";
          },
        },
        titleFont: {
          size: 12,
          family: "Inter",
          weight: "bold",
        },
        bodyFont: {
          size: 12,
          weight: "bold",
        },
      },
    },
    elements: {
      point: {
        radius: 2,
        hitRadius: 3,
        borderColor: `${color}`,
        hoverRadius: 15,
      },
      line: {
        tension: 0.3,
        borderWidth: 2,
        borderColor: `${color}`,
        fill: "start",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          const gradient = ctx.createLinearGradient(
            chartArea.left,
            chartArea.top,
            chartArea.left,
            chartArea.bottom
          );
          gradient.addColorStop(0, `${color}`);
          gradient.addColorStop(1, `${color}00`);
          return gradient;
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: 3,
        },
      },
      y: {
        grid: {
          lineWidth: 1,
          borderDash: (ctx) => (ctx.tick.value === 30 ? [8, 4] : []),
        },
        min: 0,
        max: 100,
        ticks: {
          callback: function (value, index, values) {
            return value + "%";
          },
        },
      },
      // y1: {
      //   grid: {
      //     display: false,
      //   },
      //   min: 0,
      //   max: 50,
      //   ticks: {
      //     callback: function (value, index, values) {
      //       return value + "ºC";
      //     },
      //   },
      // },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };
};

export default PlantDetails;
