const Order = require("../models/Order");
const Wallet = require("../models/Wallet");

exports.createOrder = async (req, res) => {
  try {
    const { userId, type, crypto, amount, price } = req.body;

    // ตรวจสอบว่า user มี wallet หรือไม่
    const wallet = await Wallet.findOne({ where: { userId, crypto } });
    if (!wallet) {
      return res.status(400).json({ message: "Wallet ไม่ถูกต้อง" });
    }

    // ตรวจสอบยอดเงินหรือเหรียญใน wallet
    if (type === "sell" && wallet.balance < amount) {
      return res.status(400).json({ message: "เหรียญไม่เพียงพอ" });
    }

    // บันทึกออเดอร์ลงฐานข้อมูล
    const order = await Order.create({ userId, type, crypto, amount, price });
    res.status(201).json({ message: "สร้างออเดอร์สำเร็จ", order });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // ดึงข้อมูลออเดอร์ทั้งหมดของผู้ใช้
      const orders = await Order.findAll({ where: { userId } });
  
      if (orders.length === 0) {
        return res.status(404).json({ message: "ไม่พบออเดอร์ของผู้ใช้" });
      }
  
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
  };
  
  exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // ค้นหาออเดอร์
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: "ไม่พบออเดอร์" });
      }
  
      // ตรวจสอบสถานะออเดอร์ (ต้องเป็น pending เท่านั้น)
      if (order.status !== "pending") {
        return res.status(400).json({ message: "ไม่สามารถยกเลิกออเดอร์นี้ได้" });
      }
  
      // อัปเดตสถานะเป็น "cancelled"
      await order.update({ status: "cancelled" });
  
      res.json({ message: "ยกเลิกออเดอร์สำเร็จ", order });
    } catch (error) {
      res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
  };
  