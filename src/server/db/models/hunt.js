export default (sequelize, Sequelize) => {
	const Hunt = sequelize.define('hunt', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: Sequelize.STRING(12),
			allowNull: false,
		},
		gameId: {
			type: Sequelize.STRING(50),
			allowNull: false
		},
		pokemon: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		huntType: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		odds: {
			type: Sequelize.STRING(10),
			allowNull: false
		},
		encounters: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		completed: {
			type: Sequelize.BOOLEAN,
			defaultValue: 0
		},
		completionDate: {
			type: Sequelize.DATE,
			defaultValue: null
		}
	}, {
		timestamps: true,
		createdAt: 'started',
		updatedAt: 'lastUpdated'
	});


	return Hunt;
}