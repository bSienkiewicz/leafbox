import React from "react";
// import { Data } from "../lib/data";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler, Tooltip, createLinearGradient } from 'chart.js';
 
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const Chart = ({data}) => {
  const options = {
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
      tooltip: {
        position: "nearest",
        caretSize: 0,
        bodyAlign: "center",
        xAlign: "center",
        yAlign: "center",
        displayColors: false,
        cornerRadius: 15,
        backgroundColor: "rgba(0,0,0,1)",
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
        radius: 3,
        hitRadius: 3,
      },
      line: {
        tension: 0.3,
        borderWidth: 2,
        borderColor: "rgba(96, 165, 250, 1)",
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
          gradient.addColorStop(0, "rgba(96, 165, 250, 0.7)");
          gradient.addColorStop(1, "rgba(0, 0, 155, 0)");
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
  };
  return (
    <Line data={data} className="w-full h-full" options={options} />
  )
}

export default Chart;