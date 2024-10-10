import { Card, Table, Button, Flex, Select, DatePicker } from 'antd';
import { FaSearch } from 'react-icons/fa';
import { ActionHistoryFields, actionDevices, devices } from '../../constant';
import { useEffect, useState } from 'react';
import { createQueryString, mappingActionHistory } from '../../ulti';
import axiosClient from '../../api/axios-client';

import './style.css';

const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    width: '10%',
    sorter: {
      compare: (a, b) => a.stt - b.stt,
      multiple: 3
    }
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: {
      compare: (a, b) => a.id - b.id,
      multiple: 3
    }
  },

  {
    title: 'Thiết bị',
    key: 'device',
    dataIndex: 'device',
    sorter: {
      compare: (a, b) => a.device.toString().localeCompare(b.device.toString()),
      multiple: 3
    }
  },
  {
    title: 'Hành động',
    key: 'action',
    dataIndex: 'action',
    sorter: {
      compare: (a, b) => a.action.toString().localeCompare(b.action.toString()),
      multiple: 3
    }
  },
  {
    title: 'Thời gian',
    key: 'time',
    dataIndex: 'time',
    sorter: {
      compare: (a, b) => a.time.toString().localeCompare(b.time.toString()),
      multiple: 3
    }
  }
];

function ActionTable() {
  const [data, setData] = useState();
  const [totalCount, setTotalCount] = useState();
  const [filter, setFilter] = useState({
    content: null,
    searchBy: null,
    startTime: null,
    endTime: null
  });

  const [onLed, setOnLed] = useState(0);
  const [offFan, setOffFan] = useState(0);

  const [page, setPage] = useState({
    page: null,
    pageSize: null,
    sortBy: null,
    orderBy: null
  });

  const getActionHistory = async () => {
    const queryString = createQueryString(filter, page);
    const sensorDatas = await axiosClient.get(`/table/action${queryString}`);
    setData(mappingActionHistory(sensorDatas.data));
    setTotalCount(sensorDatas.meta.totalCount);
  };

  const getCountOnLed = async () => {
    const res = await axiosClient.get(`/table/onLed`);
    console.log(res);
    setOnLed(res.totalCount);
  };

  const getCountOffFan = async () => {
    const res = await axiosClient.get(`/table/offFan`);
    console.log(res);
    setOffFan(res.totalCount);
  };

  useEffect(() => {
    getActionHistory();
  }, [page]);

  useEffect(() => {
    getCountOnLed();
    getCountOffFan();
  }, [onLed, offFan]);

  const handleChangeFilter = (data) => {
    setFilter((prev) => ({ ...prev, ...data }));
  };

  const handleClickSearch = () => {
    getActionHistory();
  };

  return (
    <div className="tabled">
      <Card bordered={false} className="criclebox tablespace mb-24" title="Action History">
        <Flex justify="space-around" align="center" style={{ margin: '20px 0' }}>
          <RangePicker
            showTime
            onChange={(_time, timeString) =>
              handleChangeFilter({
                startTime: timeString[0],
                endTime: timeString[1]
              })
            }
          />
          <Select
            defaultValue={ActionHistoryFields.ALL}
            style={{ width: 320 }}
            onChange={(e) => handleChangeFilter({ searchBy: e })}
            options={[
              { value: ActionHistoryFields.ALL, label: 'Tất cả' },
              { value: 'FAN', label: devices.FAN },
              { value: 'LED', label: devices.LED },
              { value: 'AIR_CONDITIONER', label: devices.AIR_CONDITIONER }
            ]}
          />
          <Button type="primary" icon={<FaSearch />} style={{ width: 200 }} onClick={handleClickSearch}>
            Search
          </Button>
        </Flex>

        <div>
          <p className="action__count">Số lần bật đèn: {onLed}</p>
          <p className="action__count">Số lần tắt quạt: {offFan}</p>
        </div>
        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              position: ['topRight'],
              current: filter.page,
              pageSize: filter.pageSize,
              total: totalCount
            }}
            className="ant-border-space"
            onChange={(pagination, _filters, _sorter, _extra) => {
              setPage({
                page: pagination.current,
                pageSize: pagination.pageSize
              });
            }}
          />
        </div>
      </Card>
    </div>
  );
}

export default ActionTable;
