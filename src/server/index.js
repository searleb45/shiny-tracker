const express = require('express');
const path = require('path');
import apiModule from './api';

const app = express();

app.use('/api', apiModule);

app.use(express.static(__dirname));

app.use('*', express.static(path.join(__dirname, 'index.html')));

app.listen(3000);