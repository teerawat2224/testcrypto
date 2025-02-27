const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email นี้มีอยู่แล้ว!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ค้นหาผู้ใช้จากอีเมล
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง JWT Token
    const token = jwt.sign({ userId: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });

    res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};
