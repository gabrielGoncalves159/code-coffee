const express = require('express');
const app = express();
const router = require('./router');
var cors = require('cors');

app.use(express.json());
app.use(router);
app.use(cors());

module.exports = app;