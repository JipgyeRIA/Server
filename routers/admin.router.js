const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

/** __/admin/-> */
router
  .route("/item")
  .get(adminController.renderAddMenuPage)
  .post(adminController.addMenu);

module.exports = router;
