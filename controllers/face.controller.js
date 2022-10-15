const Customer = require("../models/customer");

module.exports.saveGroup = async (res, req, next) => {
  console.log(req.body["group"]);
  try {
    for (let customer in req.body["group"]) {
      const customer = new Customer(customer);
      await customer.save();
    }

    res.set({
      "content-type": "application/json",
      charset: "utf-8",
    });
    res.json({
      success: true,
    });
  } catch (e) {
    res.set({
      "content-type": "application/json",
      charset: "utf-8",
    });
    res.json({
      success: false,
    });
  }
};
