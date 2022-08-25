import Sequelize from 'sequelize';

import createHuntModel from './models/hunt';
import createShinydexModel from './models/shinydex';

const [,user, password, host, db] = process.env.DATABASE_URL.match(/\/\/(.*):(.*)@(.*)\/(.*)\?.*/);

let connection = {};
if(user && password && host && db) {
	connection = new Sequelize(db, user, password, {
		host,
		dialect: 'mysql',
	});

	connection.hunt = createHuntModel(connection, Sequelize);
	connection.shinydex = createShinydexModel(connection, Sequelize);
}

connection.authenticate().then(() => {
	console.log('Connection successful!');
	connection.sync({ alter: true });
}).catch((err) => {
	throw new Error('Database connection unsuccessful', err);
});


export default connection;