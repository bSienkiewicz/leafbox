"use client";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { getPlantAndReadings } from "@/app/_actions";
import moment from "moment-timezone";
import Chart from "../Charts/ChartComponent";
import { prepareChartData } from "@/lib/utils";
import { useWsStore } from "@/store/zustand";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faMinus } from "@fortawesome/free-solid-svg-icons";

const SmallChartCard = ({ plantId, readingsAmmount }) => {
  const [plant, setPlant] = useState(null);
  const [readings, setReadings] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [diff, setDiff] = useState(null);
  const message = useWsStore((s) => s.moisture);

  useEffect(() => {
    if (message === null) return;
    console.log(readingsAmmount);
    const moisture_value = Buffer.from(
      message.moisture_value,
      "base64"
    ).toString();
    const timestamp = message.timestamp;
    if (parseInt(message.plant_id) === plantId) {
      setReadings((prev) => {
        if (prev && typeof prev[Symbol.iterator] === "function") {
          const newReadings = [...prev];
          newReadings.unshift({ moisture_value, timestamp });
          if (newReadings.length > readingsAmmount) {
            newReadings.pop();
          }
          return newReadings;
        }
        return [];
      });
    }
  }, [message]);

  useEffect(() => {
    if (!readings) return;
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
    calculateDiff();
  }, [readings]);

  const getReadings = async () => {
    console.log(plantId);
    const res = await getPlantAndReadings(plantId, readingsAmmount);
    setPlant(res.data.plant[0]);
    setReadings(res.data.readings);
  };

  const calculateDiff = () => {
    if (readings && readings[0] && readings[1]) {
      const diff = readings[0].moisture_value - readings[1].moisture_value;
      setDiff(diff);
    }
  };

  useEffect(() => {
    console.log(plant);
  }, [plant]);

  useEffect(() => {
    getReadings();
  }, []);

  return (
    readings &&
    plant && (
      <Link href={`/plants/${plant?.plant_id}`}>
        <Card className={"py-2 px-4 flex justify-between items-center"}>
          <div className="">
            <p className="text-xl">{plant?.plant_name}</p>
            <p className="text-sm text-gray-500">
              Last reading: {readings?.[0]?.moisture_value}%
              {diff > 0 ? (
                <span className="text-xs text-green-700 ml-3">
                  <FontAwesomeIcon icon={faCaretUp} /> {Math.abs(diff)}%
                </span>
              ) : diff < 0 ? (
                <span className="text-xs text-red-700 ml-3">
                  <FontAwesomeIcon icon={faCaretDown} /> <span>{Math.abs(diff)}%</span>
                </span>
              ) : (
                <span className="text-xs text-gray-500 ml-3">
                  <FontAwesomeIcon icon={faMinus} /> {Math.abs(diff)}%
                </span>
              )}
            </p>
          </div>
          <div className="h-14 w-32 relative">
            <div className=""></div>
            {chartData && (
              <Chart
                data={chartData}
                options={chartOptions(plant?.color, readingsAmmount)}
              />
            )}
          </div>
        </Card>
      </Link>
    )
  );
};

const chartOptions = (color = "#ff0000", readingsAmmount) => {
  return {
    maintainAspectRatio: false,
    aspectRatio: undefined,
    maxPoints: readingsAmmount,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 0,
        borderColor: `${color}`,
        hoverRadius: 0,
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
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };
};

export default SmallChartCard;
