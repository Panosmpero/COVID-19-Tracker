import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Axios from "axios";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        gridLines: {
          display: false,
        },
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const LineGraph = ({ type }) => {
  const [lineData, setLineData] = useState({});

  useEffect(() => {
    getLineData(type);

  },[type])

  const getLineData = async (type) => {
    const { data } = await Axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
    const chartData = [];
    let lastDataPoint;
      for (let date in data[type]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[type][date] - lastDataPoint
        }
        chartData.push(newDataPoint)
      }
      lastDataPoint = data[type][date];
    }
    console.log(data)
    setLineData(chartData)
  }

  
  return (
    <div>
      {lineData.length && (
        <Line data={{
        datasets: [
          {
            backgroundColor: "rgba(204, 16, 52, 0.5)",
            borderColor: "#CC1034",
            data: lineData
          }
        ]
      }}
      options={options}  />
      )}
      
    </div>
  );
};

export default LineGraph;
