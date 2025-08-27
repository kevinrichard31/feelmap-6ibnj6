const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lang = require('./Lang');

// Function to generate a random 10-character password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  lang_id: {
    type: DataTypes.BIGINT,
    references: {
      model: Lang,
      key: 'id',
    },
  },
  password: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: () => generatePassword(),
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fcm_token: { // Champ pour le token FCM
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Firebase Cloud Messaging token'
  },
  want_notification: { // Champ booléen pour l'activation des notifications
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: "L'utilisateur souhaite recevoir des notifications"
  },
}, {
  tableName: 'users',
  timestamps: false,
});

User.belongsTo(Lang, { foreignKey: 'lang_id' });

module.exports = User;
