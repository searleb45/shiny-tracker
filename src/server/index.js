import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';

import apiModule from './api';
import authModule from './auth';

const app = express();
app.use(express.json());
app.use(cookieSession({ keys: [process.env.SESSION_KEY] }));

app.use(express.static(__dirname));
app.use('/api', apiModule);
app.use('/twitchAuth', authModule);
app.use('*', express.static(path.join(__dirname, 'index.html')));

app.listen(process.env.PORT || 3000);