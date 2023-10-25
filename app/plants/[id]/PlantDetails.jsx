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
import React from "react";

const PlantDetails = ({
  plant,
  readings,
  chartData,
  editingDesc,
  setEditingDesc,
  updatePlant,
}) => {

  
  
  const handleDescriptionChange = (event) => {
    const newPlant = { ...plant };
    newPlant.description = event.target.value;
    updatePlant(newPlant);
    setEditingDesc(false);
  };

  return (
    <div className="flex flex-col md:grid grid-cols-7 grid-rows-[auto,1fr] h-full gap-3">
      <div className="col-span-7 flex gap-3">
        {readings?.[0]?.moisture_value && (
          <Card className="p-6 text-center">
            <div className="flex md:flex-col items-center md:items-start justify-between h-full gap-3">
              <CardTitle>Moisture</CardTitle>
              <p
                className="text-3xl font-bold w-full"
                style={{ color: plant?.color }}
              >
                {readings?.[0]?.moisture_value}%
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
              options={chartOptions(plant?.lower_threshold, plant?.upper_threshold, plant?.color)}
            />
          )}
        </Card>
      </div>
      <div className="RIGHT col-span-2 flex flex-col gap-3">
        {readings?.[0]?.moisture_value && (
          <Card className="">
            <CardHeader>
              <CardTitle>Last watering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" style={{ color: plant?.color }}>
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
        )}
        <Card className="flex-1">
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
  );
};

const chartOptions = (min, max, color) => {
  return {
    maintainAspectRatio: false,
    aspectRatio: undefined,
    plugins: {
      legend: {
        display: false,
        titleFont:{
          size: 12,
          family: "Inter",
          weight: "bold"
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: min,
            yMax: min,
            borderColor: 'rgb(255, 99, 132, 0.2)',
            borderWidth: 2,
            borderDash: [5, 5],
          },
          line2: {
            type: 'line',
            yMin: max,
            yMax: max,
            borderColor: 'rgba(96, 100, 250, 0.2)',
            borderWidth: 2,
            borderDash: [5, 5],
          },
        }
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
        titleFont:{
          size: 12,
          family: "Inter",
          weight: "bold"
        },
        bodyFont:{
          size: 12,
          weight: "bold"
        }
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
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
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
          borderDash: ctx => ctx.tick.value === 30 ? [8,4] : [],
        },
        min: 0,
        max: 100,
        ticks: {
          callback: function (value, index, values) {
            return value + "%";
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  }
}

export default PlantDetails;
