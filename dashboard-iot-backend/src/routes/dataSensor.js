const express = require('express');
const { postDataSensor, getDataLight } = require('../controllers/dataSensor');

const route = express.Router();

route.post('/', postDataSensor);
route.get('/light-gas', getDataLight);

module.exports = route;
