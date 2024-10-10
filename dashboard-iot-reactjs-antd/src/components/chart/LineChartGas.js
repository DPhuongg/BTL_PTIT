import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { FaMinus } from "react-icons/fa";
import { options, series } from "./configs/lineChartGas";
import {  useWebSocketStore } from "../../stores";

function LineChart() {
  const { Title } = Typography;

  const { message } = useWebSocketStore();


  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Biểu đồ</Title>
        </div>
        <div className="sales">
          <ul>
            {/* <li>{<FaMinus color="#008FFB" />} Nhiệt độ</li>
            <li>{<FaMinus color="#00E396" />} Độ ẩm</li>
            <li>{<FaMinus color="#FEB019" />} Ánh sáng</li> */}
            <li>{<FaMinus color="#AA7DDF" />} Gas</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={options(message)}
        series={series(message)}
        type="area"
        height={450}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
