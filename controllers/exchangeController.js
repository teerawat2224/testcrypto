const Wallet = require("../models/Wallet");
const ExchangeTransaction = require("../models/ExchangeTransaction");

exports.exchangeFiatToCrypto = async (req, res) => {
  try {
    const { userId, crypto, fiatAmount, exchangeRate } = req.body;

    // คำนวณจำนวนเหรียญที่ได้จากการแลก Fiat
    const cryptoAmount = fiatAmount * exchangeRate;

    // ตรวจสอบว่าผู้ใช้มียอดเงิน Fiat เพียงพอหรือไม่
    const userWallet = await Wallet.findOne({ where: { userId, crypto: "USD" } });

    if (!userWallet || userWallet.balance < fiatAmount) {
      return res.status(400).json({ message: "ยอดเงิน Fiat ไม่เพียงพอ" });
    }

    // ลดยอดเงิน Fiat และเพิ่มยอดเหรียญให้ผู้ใช้
    await userWallet.update({ balance: userWallet.balance - fiatAmount });

    // เพิ่มยอดเหรียญให้กับผู้ใช้
    let cryptoWallet = await Wallet.findOne({ where: { userId, crypto } });
    if (!cryptoWallet) {
      // ถ้ายังไม่มี wallet สำหรับเหรียญนี้ ให้สร้างใหม่
      cryptoWallet = await Wallet.create({ userId, crypto, balance: 0 });
    }

    await cryptoWallet.update({ balance: cryptoWallet.balance + cryptoAmount });

    // บันทึกการแลกเปลี่ยนลงในฐานข้อมูล
    const exchangeTransaction = await ExchangeTransaction.create({
      userId,
      crypto,
      fiatAmount,
      cryptoAmount,
      status: "completed",
    });

    res.status(200).json({ message: "แลกเหรียญสำเร็จ", exchangeTransaction });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};
