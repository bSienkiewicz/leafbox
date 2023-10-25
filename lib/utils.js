import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function prepareChartData(readings) {
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
  return data;
}
