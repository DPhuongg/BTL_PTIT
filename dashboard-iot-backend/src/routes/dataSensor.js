const express = require('express');
const { postDataSensor, getDataLight, get10DataLast, countData } = require('../controllers/dataSensor');

const route = express.Router();

route.post('/', postDataSensor);
route.get('/light-gas', getDataLight);
route.get('/10-data-last', get10DataLast);
route.get('/count-data', countData);

module.exports = route;
