const Item = require("../models/item");

/** 주문 홈 */
module.exports.renderingOrderHome = async (req, res, next) => {
  // 추천 메뉴 로딩
  const recMenus = await Item.find({ category: { $in: ["recommend"] } }).limit(
    4
  );
  const path = req.path;

  // 세트 메뉴 판매순 로딩

  // 단품 메뉴 판매순 로딩

  // 사이드 판매순 로딩

  // 음료 판매순 로딩
  res.render("order/home", { recMenus, path });
};

/** TODO: 메뉴 추천하기 */
module.exports.renderingRecommendedMenu = async (req, res, next) => {};

/** 추천메뉴 더보기 */
module.exports.renderingAllRecommendedMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["recommend"] } });
  const path = req.path;
  console.log(req.param.url);
  res.render("order/recommend", { recMenus, path });
};

/** 특정 메뉴 주문페이지 */
module.exports.renderingMenu = async (req, res, next) => {
  const { id } = req.param;
  const menu = await Item.findById(id);
  const path = req.path;
  res.render("order/menu", { menu, path });
};
