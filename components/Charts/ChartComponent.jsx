"use client";
import React, { forwardRef, useEffect } from "react";
// import { Data } from "../lib/data";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  createLinearGradient,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  annotationPlugin
);

const Chart = forwardRef(({ data, options }, ref) => {
  useEffect(() => {
    console.log(data);
  }, []);

  return <Line data={data} options={options} className="h-full" />;
});

export default Chart;
