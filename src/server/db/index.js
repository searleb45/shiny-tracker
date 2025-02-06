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
		},
		pool: {
			acquire: 90000,
			maxUses: 50
		}
	});

	connection.hunt = createHuntModel(connection, Sequelize, process.env.LOCAL_CONNECTION);
	connection.shinydex = createShinydexModel(connection, Sequelize, process.env.LOCAL_CONNECTION);
}

connection.authenticate().then(() => {
	console.log('Connection successful!');
	connection.sync({ alter: true });
}).catch((err) => {
	throw new Error('Database connection unsuccessful', err);
});


export default connection;