const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const User = require("../models/User");

const seedUsers = async () => {
  await sequelize.sync({ force: true });  // ทำการรีเซ็ตฐานข้อมูล
  console.log("Database Reset!");

  // ข้อมูลผู้ใช้เริ่มต้น
  const users = [
    { username: "user1", email: "user1@example.com", password: await bcrypt.hash("password123", 10) },
    { username: "user2", email: "user2@example.com", password: await bcrypt.hash("password123", 10) },
  ];

  // เพิ่มผู้ใช้ลงในฐานข้อมูล
  await User.bulkCreate(users);
  console.log("Seed Users Done!");
};

// เรียกใช้งานฟังก์ชัน seed
seedUsers().then(() => process.exit());
