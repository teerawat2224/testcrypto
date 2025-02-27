const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Wallet = sequelize.define("Wallet", {
  currency: { type: DataTypes.STRING, allowNull: false }, // BTC, ETH, etc.
  balance: { type: DataTypes.DECIMAL(18, 8), allowNull: false, defaultValue: 0 },
}, { timestamps: true });

User.hasMany(Wallet);
Wallet.belongsTo(User);

module.exports = Wallet;
