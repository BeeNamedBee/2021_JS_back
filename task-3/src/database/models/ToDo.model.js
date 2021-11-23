const Sequelize = require('sequelize');
const { sequelize } = require('..');

class ToDo extends Sequelize.Model {}

ToDo.init(
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
			unique: true,
        },
		userId: {
			type: Sequelize.UUID,
		},
        title: {
            type: Sequelize.STRING,
            defaultValue: 'Title',
        },
		description: {
			type: Sequelize.STRING,
			defaultValue: 'I need ...',
		},
        isCompleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
		isFavourite: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
		priority: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
		},
    },
    { 
		sequelize: sequelize,
		modelName: 'todo',
	},
);

module.exports = ToDo;
