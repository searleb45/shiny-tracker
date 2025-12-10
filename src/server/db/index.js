import Sequelize from 'sequelize';

import createHuntModel from './models/hunt';
import createShinydexModel from './models/shinydex';

let connection = {};

const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const db = process.env.DATABASE_NAME;

if(user && password && host && db) {
	connection = new Sequelize(db, user, password, {
		host,
		dialect: 'postgres',
		dialectOptions: process.env.LOCAL_CONNECTION ? undefined : {
			ssl: {
				require: true
			}
		}
	});

	connection.hunt = createHuntModel(connection, Sequelize);
	connection.shinydex = createShinydexModel(connection, Sequelize);
	
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