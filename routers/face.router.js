const express = require("express");
const router = express.Router();
const faceController = require("../controllers/face.controller");

/** __/face/-> */
router.route("/group").post(faceController.saveGroup);
