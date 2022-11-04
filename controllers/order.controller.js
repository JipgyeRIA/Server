const Item = require("../models/item");
const Customer = require("../models/customer");
const mongoose = require("mongoose");
const orderService = require("../services/order.service");

// /** 주문 홈 */
// module.exports.renderingOrderHome = async (req, res, next) => {
//   // 추천 메뉴 로딩
//   const recMenus = await Item.find({ category: { $in: ["recommend"] } }).limit(
//     4
//   );
//   const path = req.path;

//   // 세트 메뉴 판매순 로딩

//   // 단품 메뉴 판매순 로딩

//   // 사이드 판매순 로딩

//   // 음료 판매순 로딩
//   res.set({
//     "content-type": "application/json",
//     charset: "utf-8",
//   });
//   res.json({ recMenus, path });
// };

/** TODO: 메뉴 추천하기 */
module.exports.renderingRecommendedMenu = async (req, res, next) => {};

/** 추천메뉴 더보기 - 사장님 추천(머신러닝 추천 X) */
module.exports.renderingAllRecommendedMenu = async (req, res, next) => {
  const recMenus = await Item.find({}).limit(8);
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 세트 메뉴 추천하기(판매순) */
module.exports.renderingSetMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["set"] } });
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 단품 메뉴 추천하기(판매순) */
module.exports.renderingSingleMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["single"] } });
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 사이드(음료) 메뉴 추천하기(판매순) */
module.exports.renderingSideMenu = async (req, res, next) => {
  const recMenus = await Item.find({ category: { $in: ["side", "drink"] } });
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

module.exports.getMenuDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id);
    const path = req.path;

    res.set({
      "content-type": "application/json",
      charset: "utf-8",
    });

    res.json({ item, path });
  } catch (e) {
    console.log(e.message);
  }
};

/** 개인 얼굴 분석 후 메뉴 추천 */
module.exports.recommendSingleMenu = async (req, res, next) => {
  const population = 1;
  const men = 1;
  const women = 0;
  const ages = [1];
  const path = req.path;

  const recMenus = await orderService.recommendMenu(
    population,
    men,
    women,
    ages
  );

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
};

/** 그룹 판단 후 메뉴 추천 */
module.exports.recommendGroupMenu = async (req, res, next) => {
  const customers = await Customer.find();
  const { emb } = req.body;
  const path = req.path;

  let minNormVal = 1;
  let group = -1;

  for (let customer of customers) {
    const customerEmbeddingVector = strToEmbedding(customer.emb);
    const embeddingVector = strToEmbedding(emb);

    let normVal = l2Norm(customerEmbeddingVector, embeddingVector);
    if (normVal < minNormVal) {
      minNormVal = normVal;
      group = customer.group;
    }
  }

  if (group == -1) {
    // TODO: 들어온 고객 없음. => 개인 추천 각
  }

  // console.log(group);
  const customerGroup = customers.filter(customer => customer.group == group);
  // TODO: 추천 메뉴 로직.

  let population = 0;
  let men = 0;
  let women = 0;

  const set = new Set();
  customers.forEach(customer => {
    population++;
    set.add(customer.age);
    if (customer.gender == 0) {
      men++;
    } else if (customer.gender == 1) {
      women++;
    }
  });
  const ages = Array.from(set);

  const recMenus = await orderService.recommendMenu(
    population,
    men,
    women,
    ages
  );

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path });
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
