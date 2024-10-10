import { Card, Col, Flex, Row, Typography, Switch, Progress, Spin, Alert } from 'antd';
import React, { useState, useEffect } from 'react';
import LineChart from '../components/chart/LineChart';

import LineChartGas from '../components/chart/LineChartGas';
import { getTemperatureColor } from '../ulti.js';

import { FaTemperatureLow, FaFan, FaLightbulb, FaRegSnowflake } from 'react-icons/fa';
import { RiWaterPercentFill } from 'react-icons/ri';
import { MdLightMode } from 'react-icons/md';
import '../assets/styles/home.css';
import { useActionDeviceLoadingStore, useActionDeviceStore, useDataSensorStore, useWebSocketStore } from '../stores';

function Home() {
  const { Title } = Typography;
  const { temperature, humidity, light, gas } = useDataSensorStore();
  const { isOnLed, isOnAirConditioner, isOnFan, updateActionDevice } = useActionDeviceStore();
  const { isOnLedLoading, isOnAirConditionerLoading, isOnFanLoading, updateActionDeviceLoading } = useActionDeviceLoadingStore();


  const { sendMessage } = useWebSocketStore();


  const weatherDatas = [
    {
      title: 'Nhiệt độ',
      value: temperature,
      unit: '*C',
      icon: <FaTemperatureLow size={18} />,
      progressColor: '#008FFB',
      bnb: 'redtext'
    },
    {
      title: 'Độ ẩm',
      value: humidity,
      unit: '%',
      icon: <RiWaterPercentFill size={18} />,
      progressColor: '#00E396',
      bnb: 'redtext'
    },
    {
      title: 'Ánh sáng',
      value: light,
      unit: 'Lux',
      icon: <MdLightMode size={18} />,
      progressColor: '#FEB019',
      bnb: 'redtext'
    },
    {
      title: 'Gas',
      value: gas,
      unit: '???',
      icon: <MdLightMode size={18} />,
      progressColor: '#AA7DDF',
      bnb: 'redtext'
    }
  ];

  const actionDatas = [
    {
      title: 'Quạt',
      status: isOnFan,
      icon: <FaFan size={50} className={isOnFan ? 'spin-icon' : ''} />,
      isLoading: isOnFanLoading,
      onChange: async (e) => {
        updateActionDeviceLoading({
          isOnFanLoading: !isOnFanLoading
        });
        sendMessage({
          topic: 'action/fan',
          message: e ? 'on' : 'off'
        });
        // updateActionDevice({ isOnFan: e });
      }
    },
    {
      title: 'Điều hòa',
      status: isOnAirConditioner,
      icon: <FaRegSnowflake size={50} color={isOnAirConditioner ? 'rgb(140, 208, 242)' : ''} />,
      isLoading: isOnAirConditionerLoading,
      onChange: (e) => {
        updateActionDeviceLoading({
          isOnAirConditionerLoading: !isOnAirConditionerLoading
        });
        sendMessage({
          topic: 'action/air_conditioner',
          message: e ? 'on' : 'off'
        });
        // updateActionDevice({ isOnAirConditioner: e });
      }
    },
    {
      title: 'Đèn',
      status: isOnLed,
      icon: <FaLightbulb size={50} color={isOnLed ? 'yellow' : ''} />,
      isLoading: isOnLedLoading,
      onChange: (e) => {
        // updateActionDevice({ isOnLed: e });
        updateActionDeviceLoading({
          isOnLedLoading: !isOnLedLoading
        });
        sendMessage({
          topic: 'action/led',
          message: e ? 'on' : 'off'
        });
      }
    }
  ];

  return (
    <>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {weatherDatas.map((c, index) => (
            <Col key={index} xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
              <Card
                bordered={false}
                className="criclebox"
                style={{
                  backgroundColor:
                    c.title === 'Nhiệt độ' && gas < 60 ? getTemperatureColor(gas) : c.title === 'Ánh sáng' && gas < 60 ? '#FDE4EA' : '#fff'
                }}
              >
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={6}>
                      <span style={{ color: '#000' }}>{c.title}</span>
                      <Title level={3}>
                        {c.value} <small style={{ color: c.progressColor }}>{c.unit}</small>
                      </Title>
                    </Col>
                    <Col xs={14}>
                      <Progress percent={c.title === 'Ánh sáng' ? (c.value / 1024) * 100 : c.value} showInfo={false} strokeColor={c.progressColor} />
                    </Col>
                    <Col xs={4}>
                      <div className="icon-box" style={{ backgroundColor: c.progressColor }}>
                        {c.icon}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {gas > 60 && (
            <Alert message="Warning" description="Giá trị gas > 60 ?????" type="warning" showIcon closable style={{ marginBottom: '20px' }} />
          )}
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={11}>
            <Card bordered={false} className="criclebox h-full" style={{ width: '100%' }}>
              <LineChart style={{ width: '100%' }} />
            </Card>
          </Col>
          <Col xs={9}>
            <Card bordered={false} className="criclebox h-full" style={{ width: '100%' }}>
              <LineChartGas style={{ width: '100%' }} />
            </Card>
          </Col>
          <Col xs={4}>
            <Flex vertical justify="flex-start" className="h-full">
              {actionDatas.map((action, index) => (
                <Card
                  key={index}
                  style={{
                    marginBottom: '15px',
                    backgroundColor: action.title === 'Điều hòa' && isOnFan ? '#FDE4EA' : '#fff'
                  }}
                >
                  <Row gutter={[24, 0]}>
                    <Col xs={15}>
                      <Title level={5} style={{ margin: 0 }}>
                        {action.title}
                      </Title>
                      <Switch checkedChildren="ON" unCheckedChildren="OFF" onChange={action.onChange} value={action.status} />
                      <Spin spinning={action.isLoading} />
                    </Col>
                    <Col xs={9}>{action.icon}</Col>
                  </Row>
                </Card>
              ))}
            </Flex>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
