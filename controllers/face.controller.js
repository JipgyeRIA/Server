const Customer = require("../models/customer");

module.exports.saveGroup = async (req, res, next) => {
  try {
    for (let customer in req.body["group"]) {
      const newCustomer = new Customer(req.body["group"][customer]);
      await newCustomer.save();
    }

    res.set({
      "content-type": "application/json",
      charset: "utf-8",
    });
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e.message);
    res.set({
      "content-type": "application/json",
      charset: "utf-8",
    });
    res.json({
      success: false,
    });
  }
};
