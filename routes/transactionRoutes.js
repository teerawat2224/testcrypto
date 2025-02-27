const express = require("express");
const { transferCrypto, buyCryptoFromAnotherUser } = require("../controllers/transactionController");

const router = express.Router();

router.post("/transfer", transferCrypto);
router.post("/buy", buyCryptoFromAnotherUser);

module.exports = router;
