import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function prepareChartData(readings) {
  const labelsR = readings
    ?.map((reading) => moment(reading.timestamp).add(1, "hours").format("HH:mm"))
    .reverse();
  const moistureValues = readings
    ?.map((reading) => reading.moisture_value)
    .reverse();
  const data = {
    labels: labelsR,
    datasets: [
      {
        data: moistureValues,
      },
    ],
  };
  return data;
}
