const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM("buy", "sell"), allowNull: false }, // buy = ซื้อ, sell = ขาย
  crypto: { type: DataTypes.STRING, allowNull: false }, // เช่น BTC, ETH
  amount: { type: DataTypes.FLOAT, allowNull: false }, // จำนวนเหรียญ
  price: { type: DataTypes.FLOAT, allowNull: false }, // ราคาต่อหน่วย
  status: { type: DataTypes.ENUM("pending", "completed", "cancelled"), defaultValue: "pending" },
});

User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;
