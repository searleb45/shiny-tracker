export default (sequelize, Sequelize, local) => {
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
			field: local ? undefined : 'userid'
		},
		gameId: {
			type: Sequelize.STRING(50),
			allowNull: false,
			field: local ? undefined : 'gameid'
		},
		originGame: {
			type: Sequelize.STRING(50),
			allowNull: false,
			field: local ? undefined : 'origingame'
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
		createdAt: local ? undefined : 'createdat',
		updatedAt: local ? undefined : 'updatedat'
	});

	return Shinydex;
}