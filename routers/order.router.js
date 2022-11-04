const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

/** __/order/-> */
// router.route("/home").get(orderController.renderingOrderHome);
router.route("/recommend/all").get(orderController.renderingAllRecommendedMenu);
router.route("/recommend/set-menu").get(orderController.renderingSetMenu);
router.route("/recommend/single-menu").get(orderController.renderingSingleMenu);
router.route("/recommend/side-menu").get(orderController.renderingSideMenu);

router.route("/recommend/single").get(orderController.recommendSingleMenu);
router.route("/recommend/group").post(orderController.recommendGroupMenu);
router.route("/item/:id").get(orderController.getMenuDetail);

module.exports = router;
