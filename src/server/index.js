import express from 'express';
import path from 'path';
import apiModule from './api';

const app = express();
app.use(express.json());

app.use('/api', apiModule);

app.use(express.static(__dirname));

app.use('*', express.static(path.join(__dirname, 'index.html')));

app.listen(process.env.PORT || 3000);