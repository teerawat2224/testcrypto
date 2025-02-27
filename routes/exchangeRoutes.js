const express = require("express");
const { exchangeFiatToCrypto } = require("../controllers/exchangeController");

const router = express.Router();

// เพิ่ม Route สำหรับแลกเงินเป็นเหรียญ
router.post("/exchange", exchangeFiatToCrypto);

module.exports = router;
