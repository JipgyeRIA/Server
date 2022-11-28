const Item = require("../models/item");
const Customer = require("../models/customer");
const mongoose = require("mongoose");
const orderService = require("../services/order.service");

/** 추천메뉴 더보기 - 사장님 추천(머신러닝 추천 X) */
module.exports.renderingAllRecommendedMenu = async (req, res, next) => {
  const page = req.query.page ?? 1;
  const maxPage = Math.ceil((await Item.count()) / 6) + 1;
  const recMenus = await Item.find({})
    .skip((page - 1) * 6)
    .limit(6);
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path, maxPage });
};

/** 세트 메뉴 추천하기(판매순) */
module.exports.renderingSetMenu = async (req, res, next) => {
  const path = req.path;
  const page = req.query.page ?? 1;
  const maxPage =
    Math.ceil((await Item.find({ category: { $in: ["set"] } }).count()) / 6) +
    1;
  const recMenus = await Item.find({ category: { $in: ["set"] } })
    .skip((page - 1) * 6)
    .limit(6);

  console.log(path, page, maxPage, req.query);

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path, maxPage });
};

/** 단품 메뉴 추천하기(판매순) */
module.exports.renderingSingleMenu = async (req, res, next) => {
  const page = req.query.page ?? 1;
  const maxPage =
    Math.ceil(
      (await Item.find({ category: { $in: ["single"] } }).count()) / 6
    ) + 1;
  const recMenus = await Item.find({ category: { $in: ["single"] } })
    .skip((page - 1) * 6)
    .limit(6);
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path, maxPage });
};

/** 사이드(음료) 메뉴 추천하기(판매순) */
module.exports.renderingSideMenu = async (req, res, next) => {
  const page = req.query.page ?? 1;
  const maxPage =
    Math.ceil(
      (await Item.find({
        category: { $in: ["side", "drink"] },
      }).count()) / 6
    ) + 1;
  const recMenus = await Item.find({ category: { $in: ["side", "drink"] } })
    .skip((page - 1) * 6)
    .limit(6);
  const path = req.path;

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });
  res.json({ recMenus, path, maxPage });
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
  const singleInfo = req.body["single_info"];
  const page = req.query.page ?? 1;

  const { population, ages } = singleInfo;
  let men = 0;
  let women = 0;
  const path = req.path;

  singleInfo["gender"].forEach(g => {
    if (g == 0) {
      men++;
    } else if (g == 1) {
      women++;
    }
  });

  const maxPage = await orderService.getMaxPage(
    population,
    men,
    women,
    ages,
    page
  );
  const recMenus = await orderService.recommendMenu(
    population,
    men,
    women,
    ages,
    page
  );

  res.set({
    "content-type": "application/json",
    charset: "utf-8",
  });

  res.json({
    recMenus,
    path,
    maxPage,
    singleInfo: singleInfo ?? null,
    population,
    men,
    women,
    ages,
  });
};

/** 그룹 판단 후 메뉴 추천 */
module.exports.recommendGroupMenu = async (req, res, next) => {
  const page = req.query.page ?? 1;
  const customers = await Customer.find().sort({ createdAt: -1 });
  const { emb } = req.body;
  const path = req.path;

  let minNormVal = 1;
  let group = -1;

  for (let customer of customers) {
    const customerEmbeddingVector = strToEmbedding(customer.emb);
    const embeddingVector = strToEmbedding(emb);
    let normVal = l2Norm(customerEmbeddingVector, embeddingVector);

    if (normVal > 0.6) {
      continue;
    }

    if (normVal < minNormVal) {
      minNormVal = normVal;
      group = customer.group;
    }
  }

  if (group == -1) {
    // 일치하는 그룹이 없을 때
    console.log("Redirecting to Recommend Single Page");
    res.set({
      "content-type": "application/json",
      charset: "utf-8",
    });
    res.json({ result: false });
  } else {
    const customerGroup = customers.filter(customer => customer.group == group);

    let population = 0;
    let men = 0;
    let women = 0;

    const set = new Set();
    customerGroup.forEach(customer => {
      population++;
      set.add(customer.age);
      if (customer.gender == 0) {
        men++;
      } else if (customer.gender == 1) {
        women++;
      }
    });
    const ages = Array.from(set);

    const maxPage = await orderService.getMaxPage(
      population,
      men,
      women,
      ages,
      page
    );
    const recMenus = await orderService.recommendMenu(
      population,
      men,
      women,
      ages,
      page
    );

    res.set({
      "content-type": "application/json",
      charset: "utf-8",
    });

    res.json({
      result: true,
      recMenus,
      path,
      maxPage,
      population,
      men,
      women,
      ages,
    });
  }
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
  return Math.sqrt(normVal);
}
