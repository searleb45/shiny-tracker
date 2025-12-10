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
			field: 'userid'
		},
		gameId: {
			type: Sequelize.STRING(50),
			allowNull: false,
			field: 'gameid'
		},
		pokemon: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		huntType: {
			type: Sequelize.STRING(100),
			allowNull: false,
			field: 'hunttype'
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
			field: 'isstaticodds'
		},
		hasShinyCharm: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: 'hasshinycharm'
		},
		hasLure: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: 'haslure'
		},
		hasResearch10: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: 'hasresearch10'
		},
		hasResearchPerfect: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: 'hasresearchperfect'
		},
		hasSparklingPower: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			field: 'hassparklingpower'
		},
		completionDate: {
			type: Sequelize.DATE,
			defaultValue: null,
			field: 'completiondate'
		}
	}, {
		timestamps: true,
		createdAt: 'started',
		updatedAt: 'lastupdated'
	});


	return Hunt;
}