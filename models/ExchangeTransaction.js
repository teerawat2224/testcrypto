const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ExchangeTransaction = sequelize.define("ExchangeTransaction", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  crypto: { type: DataTypes.STRING, allowNull: false },
  fiatAmount: { type: DataTypes.FLOAT, allowNull: false },
  cryptoAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM("completed", "failed"), defaultValue: "completed" },
});

module.exports = ExchangeTransaction;
