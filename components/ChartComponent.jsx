"use client"
import React, { useEffect } from "react";
// import { Data } from "../lib/data";
import { Line } from "react-chartjs-2";
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler, Tooltip, createLinearGradient } from 'chart.js';
 
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, annotationPlugin);

const Chart = ({data, min, max}) => {
  useEffect(() => {
    console.log(data)
  }, [])

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
        borderColor: "rgba(96, 165, 250, 1)",
        hoverRadius: 15,
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
    <Line data={data} options={options} />
  )
}

export default Chart;