const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Emotion = require('./Emotion');

const Goal = sequelize.define('Goal', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    emotionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Emotion,
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [0, 10000],
        },
    },
    targetDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = in progress, true = completed
    },
    accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = not accepted, true = accepted
    },
}, {
    tableName: 'goals',
    timestamps: false,
});

Goal.belongsTo(User, { foreignKey: 'userId' });
Goal.belongsTo(Emotion, { foreignKey: 'emotionId' });

module.exports = Goal;
