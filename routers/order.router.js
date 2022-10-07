const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

/** __/order/-> */
router.route("/home").get(orderController.renderingOrderHome);
router.route("/recommend").get(orderController.renderingAllRecommendedMenu);
router.route("/specific/:id").get(orderController.renderingMenu);

module.exports = router;
