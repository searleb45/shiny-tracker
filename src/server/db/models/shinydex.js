export default (sequelize, Sequelize) => {
	const Shinydex = sequelize.define('shinydex', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: Sequelize.STRING(12),
			allowNull: false,
			field: 'userid'
		},
		gameId: {
			type: Sequelize.STRING(50),
			allowNull: false,
			field: 'gameid'
		},
		originGame: {
			type: Sequelize.STRING(50),
			allowNull: false,
			field: 'origingame'
		},
		pokemon: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		notes: {
			type: Sequelize.STRING
		}
	}, {
		freezeTableName: true,
		createdAt: 'createdat',
		updatedAt: 'updatedat'
	});

	return Shinydex;
}