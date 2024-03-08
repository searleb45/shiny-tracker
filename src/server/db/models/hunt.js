export default (sequelize, Sequelize, local) => {
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
			field: local ? undefined : 'userid'
		},
		gameId: {
			type: Sequelize.STRING(50),
			allowNull: false,
			field: local ? undefined : 'gameid'
		},
		pokemon: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		huntType: {
			type: Sequelize.STRING(100),
			allowNull: false,
			field: local ? undefined : 'hunttype'
		},
		odds: {
			type: Sequelize.STRING(10),
			allowNull: true
		},
		encounters: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		completed: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		isStaticOdds: {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
			field: local ? undefined : 'isstaticodds'
		},
		hasShinyCharm: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: local ? undefined : 'hasshinycharm'
		},
		hasLure: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: local ? undefined : 'haslure'
		},
		hasResearch10: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: local ? undefined : 'hasresearch10'
		},
		hasResearchPerfect: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: local ? undefined : 'hasresearchperfect'
		},
		hasSparklingPower: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: local ? undefined : 'hassparklingpower'
		},
		completionDate: {
			type: Sequelize.DATE,
			defaultValue: null,
			field: local ? undefined : 'completiondate'
		}
	}, {
		timestamps: true,
		createdAt: 'started',
		updatedAt: local ? 'lastUpdated' : 'lastupdated'
	});


	return Hunt;
}