const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shop', 'postgres', '@#$Mo96321', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
