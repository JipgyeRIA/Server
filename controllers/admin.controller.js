const Item = require("../models/item");

module.exports.renderAddMenuPage = async (req, res, next) => {
  const path = req.path;
  console.log("Hello World1");

  res.render("admin/addMenu", { path });
};

module.exports.addMenu = async (req, res, next) => {
  const newItem = new Item(req.body);
  console.log("Hello World2");
  // const category = [];
  // req.body.category.forEach()
  // console.log(req.body);
  console.log(req.body.category);
  const path = req.path;
  // await newItem.save();
  res.redirect("/admin/item");
};
