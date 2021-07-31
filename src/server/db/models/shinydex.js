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
		},
		gameId: {
			type: Sequelize.STRING(50),
			allowNull: false
		},
		pokemon: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		form: {
			type: Sequelize.STRING(15)
		}
	});

	return Shinydex;
}