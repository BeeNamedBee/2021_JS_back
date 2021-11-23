const Sequelize = require('sequelize');
const { sequelize } = require('..');

class Token extends Sequelize.Model {}

Token.init(
	{
    	id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			unique: true,
		},
		userId:{
			type: Sequelize.UUID,
		},
		value: {
			type: Sequelize.STRING,
		},
	},
	{
		sequelize: sequelize,
		modelName: 'token',
	}
);

module.exports = Token;
