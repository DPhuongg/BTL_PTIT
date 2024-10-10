import { convertUtcToVnTime } from "../../../ulti";

export const series = (data) => [
  {
    name: "Gas",
    data: data.gass,
    offsetY: 0,
  },
];

export const options = (data) => {
  return {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      },
    },
    legend: {
      show: false,
    },
    colors: ['#AA7DDF'],
    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
      width: [2],
    },

    yaxis: [
      {
        opposite: false,
        title: {
          text: "Gas",
        },
        seriesName: "Gas",
        min: 0,
        max: 100,
        tickAmount: 5,
      },
    ],

    xaxis: {
      categories: data.times.map(t => convertUtcToVnTime(t))
    },

    tooltip: {
      y: [
        {
          formatter: function (val) { 
            return val + " ???";  
          },
        },
      ],
    },
    animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } }
  }
}