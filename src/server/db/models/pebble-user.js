export default (sequelize, Sequelize) => {
	const PebbleUser = sequelize.define('pebbleuser', {
		pblAcctId: {
			type: Sequelize.STRING(50),
			primaryKey: true,
			allowNull: false,
			field: 'pblacctid'
		},
		twitchId: {
			type: Sequelize.STRING(12),
			allowNull: false,
			field: 'twitchid'
		}
	});

	return PebbleUser;
}