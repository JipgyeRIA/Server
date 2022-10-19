const Item = require("../models/item");
const Customer = require("../models/customer");

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
  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** TODO: 메뉴 추천하기 */
module.exports.renderingRecommendedMenu = async (req, res, next) => {};

/** 추천메뉴 더보기 - 사장님 추천(머신러닝 추천 X) */
module.exports.renderingAllRecommendedMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["recommend"] } });
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 세트 메뉴 추천하기(판매순) */
module.exports.renderingSetMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["set-menu"] } });
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 단품 메뉴 추천하기(판매순) */
module.exports.renderingSingleMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["single-menu"] } });
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 사이드(음료) 메뉴 추천하기(판매순) */
module.exports.renderingSideMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["side-menu"] } });
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 특정 메뉴 주문페이지 */
module.exports.renderingMenu = async (req, res, next) => {
  const { id } = req.param;
  const menu = await Item.findById(id);
  const path = req.path;
  res.render("order/menu", { menu, path });
};

/** 그룹 판단 후 메뉴 추천 */
module.exports.recommendGroupMenu = async (req, res, next) => {
  const customers = await Customer.find();
  const { emb } = req.body;

  let minNormVal = 1;
  let group = -1;

  for (let customer of customers) {
    const customerEmbeddingVector = strToEmbedding(customer.emb);
    const embeddingVector = strToEmbedding(emb);

    let normVal = l2Norm(customerEmbeddingVector, embeddingVector);
    // console.log(normVal);
    if (normVal < minNormVal) {
      minNormVal = normVal;
      group = customer.group;
    }
  }

  if (group == -1) {
    // TODO: 들어온 고객 없음. => 개인 추천 각
  }

  const customerGroup = customers.filter(customer => customer.group == group);
  // TODO: 추천 메뉴 로직.

  res.redirect("/order/home");
};

function strToEmbedding(faceStr, precision = 4, embedding_size = 128) {
  const faceEmbedding = [];
  for (let i = 0; i < embedding_size; i++) {
    val = faceStr.substring(i * (precision + 1), (i + 1) * (precision + 1));
    val = val[0] + "." + val.substring(1);
    val = Number(val);
    faceEmbedding.push(val);
  }

  return faceEmbedding;
}

function l2Norm(x, y) {
  let normVal = 0;
  x.forEach((val, i) => {
    normVal += (val - y[i]) ** 2;
  });

  console.log(normVal);
  return Math.sqrt(normVal);
}
