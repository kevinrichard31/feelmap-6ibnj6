const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // si tu veux relier les réponses à un utilisateur

const SurveyAnswer = sequelize.define('SurveyAnswer', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  image_paths: {
    type: DataTypes.ARRAY(DataTypes.STRING), // si tu es en PostgreSQL
    allowNull: true,
  },
  
}, {
  tableName: 'survey_answers',
  timestamps: false,
});

SurveyAnswer.belongsTo(User, { foreignKey: 'user_id' });

module.exports = SurveyAnswer;
