import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';
import sslRedirect from 'heroku-ssl-redirect';

import apiModule from './api';
import authModule from './auth';

const app = express();
if(process.env.NODE_ENV === 'production') {
	app.use(sslRedirect());
}
app.use(express.json());
app.use(cookieSession({ keys: [process.env.SESSION_KEY], maxAge: 1000 * 60 * 60 * 24 * 365 }));

app.use(express.static(__dirname));
app.use('/api', apiModule);
app.use('/twitchAuth', authModule);
app.use('*', express.static(path.join(__dirname, 'index.html')));

app.listen(process.env.PORT || 3000);