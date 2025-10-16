const express = require("express");
const { placeOrder, getPartnerOrder } = require("../controller/placeorder.controller");
const { authUser, authFoodPartner } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/order", authUser, placeOrder);
router.get("/partner/orders", authFoodPartner, getPartnerOrder);
module.exports = router;
