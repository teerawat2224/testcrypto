const express = require("express");
const { createOrder, getOrdersByUser, cancelOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders/:userId", getOrdersByUser);
router.put("/orders/cancel/:orderId", cancelOrder);



module.exports = router;
