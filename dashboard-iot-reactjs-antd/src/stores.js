import { create } from 'zustand';

export const useDataSensorStore = create((set) => ({
  temperature: 0,
  humidity: 0,
  light: 0,
  gas: 0,
  updateDataSensor: (data) => set(() => data)
}));

export const useActionDeviceStore = create((set) => ({
  isOnLed: false,
  isOnAirConditioner: false,
  isOnFan: false,
  updateActionDevice: (data) =>
    set((stage) => ({
      ...stage,
      ...data
    }))
}));

export const useActionDeviceLoadingStore = create((set) => ({
  isOnLedLoading: false,
  isOnAirConditionerLoading: false,
  isOnFanLoading: false,
  isOnLampLoading: false,
  updateActionDeviceLoading: (data) =>
    set((stage) => ({
      ...stage,
      ...data
    }))
}));
var checkLed = 0;

export const useWebSocketStore = create((set, get) => ({
  socket: null,
  message: {
    temperatures: [],
    humiditys: [],
    lights: [],
    times: [],
    gass: []
  },
  isOpen: false,
  updateDataSensorArray: (data) => {
    set((stage) => {
      const newMessage = {
        temperatures: [...stage.message.temperatures, data.temperature].slice(-10),
        humiditys: [...stage.message.humiditys, data.humidity].slice(-10),
        lights: [...stage.message.lights, data.light].slice(-10),
        times: [...stage.message.times, data.createdAt].slice(-10),
        gass: [...stage.message.gass, data.gas].slice(-10)
      };
      return {
        ...stage,
        message: newMessage
      };
    });
  },
  connect: (url) => {
    const ws = new WebSocket(url);
    const updateDataSensor = useDataSensorStore.getState().updateDataSensor;
    const updateActionDevice = useActionDeviceStore.getState().updateActionDevice;
    const updateActionDeviceLoading = useActionDeviceLoadingStore.getState().updateActionDeviceLoading;

    ws.onopen = () => {
      console.log('WebSocket is open now.');
      set({ isOpen: true });
    };

    ws.onmessage = (event) => {
      const { topic, data } = JSON.parse(event.data);
      if (topic === 'sensorData') {
        if (data.light < 500 && checkLed >= 500) {
          const sendMessage = get().sendMessage;
          sendMessage({
            topic: 'action/fan',
            message: 'on'
          });
          checkLed = data.light;
        }
        if (data.light >= 500 && checkLed < 500) {
          const sendMessage = get().sendMessage;
          sendMessage({
            topic: 'action/fan',
            message: 'off'
          });
          checkLed = data.light;
        }

        updateDataSensor(data);
        set((stage) => {
          const newMessage = {
            temperatures: [...stage.message.temperatures, data.temperature].slice(-10),
            humiditys: [...stage.message.humiditys, data.humidity].slice(-10),
            lights: [...stage.message.lights, data.light].slice(-10),
            times: [...stage.message.times, data.createdAt].slice(-10),
            gass: [...stage.message.gass, data.gas].slice(-10)
          };
          return {
            ...stage,
            message: newMessage
          };
        });
      } else if (topic === 'ledok') {
        updateActionDevice({ isOnLed: data === 'on' });
        updateActionDeviceLoading({ isOnLedLoading: !data === 'on' });
      } else if (topic === 'air_conditionerok') {
        updateActionDevice({ isOnAirConditioner: data === 'on' });
        updateActionDeviceLoading({ isOnAirConditionerLoading: !data === 'on' });
      } else if (topic === 'fanok') {
        updateActionDevice({ isOnFan: data === 'on' });
        updateActionDeviceLoading({ isOnFanLoading: !data === 'on' });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket is closed now.');
      set({ isOpen: false });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    set({ socket: ws });
  },
  sendMessage: (message) => {
    const socket = get().socket;
    const isOpen = get().isOpen;

    if (socket && isOpen) {
      socket.send(JSON.stringify(message)); // Gửi tin nhắn qua WebSocket
    } else {
      console.error('WebSocket is not open.');
    }
  },
  closeConnection: () => {
    const socket = get().socket;
    if (socket) {
      socket.close(); // Đóng kết nối WebSocket
    }
  }
}));
