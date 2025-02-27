const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Transaction = sequelize.define("Transaction", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fromUserId: { type: DataTypes.INTEGER, allowNull: false },
  toUserId: { type: DataTypes.INTEGER, allowNull: false },
  crypto: { type: DataTypes.STRING, allowNull: false }, // เช่น BTC, ETH
  amount: { type: DataTypes.FLOAT, allowNull: false }, // จำนวนที่โอน
  status: { type: DataTypes.ENUM("completed", "failed"), defaultValue: "completed" },
});

User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = Transaction;
