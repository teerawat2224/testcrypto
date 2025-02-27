const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

exports.transferCrypto = async (req, res) => {
  try {
    const { fromUserId, toUserId, crypto, amount } = req.body;

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "ไม่สามารถโอนให้ตัวเองได้" });
    }

    // ตรวจสอบว่าส่งเหรียญไปให้ใคร และต้องมี Wallet
    const senderWallet = await Wallet.findOne({ where: { userId: fromUserId, crypto } });
    const receiverWallet = await Wallet.findOne({ where: { userId: toUserId, crypto } });

    if (!senderWallet || !receiverWallet) {
      return res.status(400).json({ message: "บัญชี Wallet ไม่ถูกต้อง" });
    }

    // ตรวจสอบว่าผู้โอนมีเหรียญเพียงพอหรือไม่
    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "เหรียญไม่เพียงพอ" });
    }

    // ทำธุรกรรม (ลดจากผู้โอน เพิ่มให้ผู้รับ)
    await senderWallet.update({ balance: senderWallet.balance - amount });
    await receiverWallet.update({ balance: receiverWallet.balance + amount });

    // บันทึกธุรกรรมลงฐานข้อมูล
    const transaction = await Transaction.create({
      fromUserId,
      toUserId,
      crypto,
      amount,
      status: "completed",
    });

    res.status(200).json({ message: "โอนเหรียญสำเร็จ", transaction });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

exports.buyCryptoFromAnotherUser = async (req, res) => {
    try {
      const { buyerId, sellerId, crypto, amount, price } = req.body;
  
      // คำนวณราคาที่ต้องจ่ายทั้งหมดใน Fiat
      const totalPrice = amount * price;
  
      // ตรวจสอบว่าผู้ซื้อมีเงิน Fiat เพียงพอหรือไม่
      const buyerWallet = await Wallet.findOne({ where: { userId: buyerId, crypto: "USD" } });
      if (!buyerWallet || buyerWallet.balance < totalPrice) {
        return res.status(400).json({ message: "ยอดเงิน Fiat ของผู้ซื้อไม่เพียงพอ" });
      }
  
      // ตรวจสอบว่าผู้ขายมีเหรียญที่ต้องการขายเพียงพอหรือไม่
      const sellerWallet = await Wallet.findOne({ where: { userId: sellerId, crypto } });
      if (!sellerWallet || sellerWallet.balance < amount) {
        return res.status(400).json({ message: "ยอดเหรียญของผู้ขายไม่เพียงพอ" });
      }
  
      // ลดยอดเงิน Fiat ของผู้ซื้อ
      await buyerWallet.update({ balance: buyerWallet.balance - totalPrice });
  
      // เพิ่มยอดเงิน Fiat ให้กับผู้ขาย
      let sellerFiatWallet = await Wallet.findOne({ where: { userId: sellerId, crypto: "USD" } });
      if (!sellerFiatWallet) {
        sellerFiatWallet = await Wallet.create({ userId: sellerId, crypto: "USD", balance: 0 });
      }
      await sellerFiatWallet.update({ balance: sellerFiatWallet.balance + totalPrice });
  
      // ลดเหรียญจากผู้ขาย
      await sellerWallet.update({ balance: sellerWallet.balance - amount });
  
      // เพิ่มเหรียญให้กับผู้ซื้อ
      let buyerCryptoWallet = await Wallet.findOne({ where: { userId: buyerId, crypto } });
      if (!buyerCryptoWallet) {
        buyerCryptoWallet = await Wallet.create({ userId: buyerId, crypto, balance: 0 });
      }
      await buyerCryptoWallet.update({ balance: buyerCryptoWallet.balance + amount });
  
      // บันทึกการทำธุรกรรม
      const transaction = await Transaction.create({
        buyerId,
        sellerId,
        crypto,
        amount,
        price,
        status: "completed",
      });
  
      res.status(200).json({ message: "การซื้อขายเหรียญสำเร็จ", transaction });
    } catch (error) {
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการซื้อขาย", error: error.message });
    }
  };
