import Sequelize from 'sequelize';

import createHuntModel from './models/hunt';
import createShinydexModel from './models/shinydex';

let connection = {};
let user, password, host, db;
if (process.env.LOCAL_CONNECTION) {
	[,user, password, host, db] = process.env.DATABASE_URL.match(/\/\/(.*):(.*)@(.*)\/(.*)\?.*/);
} else {
	user = process.env.DATABASE_USER;
	password = process.env.DATABASE_PASSWORD;
	host = process.env.DATABASE_HOST;
	db = process.env.DATABASE_NAME;
}

if(user && password && host && db) {
	connection = new Sequelize(db, user, password, {
		host,
		dialect: process.env.LOCAL_CONNECTION ? 'mysql' : 'postgres',
		dialectOptions: process.env.LOCAL_CONNECTION ? undefined : {
			ssl: {
				require: true
			}
		}
	});

	connection.hunt = createHuntModel(connection, Sequelize, process.env.LOCAL_CONNECTION);
	connection.shinydex = createShinydexModel(connection, Sequelize, process.env.LOCAL_CONNECTION);
	
	authConnection();
}

function authConnection(isRetry = false) {
	connection.authenticate().then(() => {
		console.log(isRetry ? 'Connection retry worked!' : 'Connection successful!');
		connection.sync({ alter: true });
		isRetry = false;
	}).catch((err) => {
		if (!isRetry) {
			console.error('Database connection error, retrying in 10 seconds...');
			console.error(err);
			setTimeout(() => authConnection(true), 10000);
		} else {
			console.error('Retry also failed, check DB usage stats.', err);
			throw new Error('Database connection unsuccessful', err);
		}
	});
}

export default connection;