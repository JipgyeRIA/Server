const Item = require("../models/item");

// 인원수, 남성수, 여성수, 연령대그룹
module.exports.getMaxPage = async (
  population = 1,
  men = 0,
  women = 0,
  ages = [1]
) => {
  if (population == 1) {
    return (
      Math.ceil(
        (await Item.find({
          serving: 1,
          gender: { $in: [men > women ? 0 : 1, 2] },
          preferredAge: { $in: ages },
          category: { $nin: ["side", "drink"] },
        }).count()) / 6
      ) + 1
    );
  } else if (population == 2) {
    if (men == women) {
      // 커플
      return (
        Math.ceil(
          (await Item.find({
            category: { $in: ["couple"] },
            preferredAge: { $in: ages },
          }).count()) / 6
        ) + 1
      );
    } else if (men > women) {
      // 남성 친구
      return (
        Math.ceil(
          (await Item.find({
            serving: { $gte: 2 },
            preferredAge: { $in: ages },
            gender: { $in: [0, 2] },
          }).count()) / 6
        ) + 1
      );
    } else {
      // 여성 친구
      return (
        Math.ceil(
          (await Item.find({
            serving: { $gte: 2 },
            preferredAge: { $in: ages },
            gender: { $in: [1, 2] },
          }).count()) / 6
        ) + 1
      );
    }
  } else {
    // 단체
    return (
      Math.ceil(
        (await Item.find({
          serving: { $gte: 3 },
          // category: { $in: ["set"] },
          preferredAge: { $in: ages },
        }).count()) / 6
      ) + 1
    );
  }
};

// 인원수, 남성수, 여성수, 연령대그룹
module.exports.recommendMenu = async (
  population = 1,
  men = 0,
  women = 0,
  ages = [1],
  page = 1
) => {
  console.log(
    `사람 수: ${population}, 남자: ${men}, 여자: ${women}, 나이대: ${ages}, 페이지: ${page}`
  );
  if (population == 1) {
    console.log("개인 추천 메뉴");
    return await Item.find({
      serving: 1,
      gender: { $in: [men > women ? 0 : 1, 2] },
      preferredAge: { $in: ages },
      category: { $nin: ["side", "drink"] },
    })
      .skip((page - 1) * 6)
      .limit(6);
  } else if (population == 2) {
    if (men == women) {
      // 커플
      console.log("커플 추천 메뉴");
      return await Item.find({
        category: { $in: ["couple"] },
        preferredAge: { $in: ages },
      })
        .skip((page - 1) * 6)
        .limit(6);
    } else if (men > women) {
      // 남성 친구
      console.log("남성 친구 2");
      return await Item.find({
        serving: { $gte: 2 },
        preferredAge: { $in: ages },
        gender: { $in: [0, 2] },
      })
        .skip((page - 1) * 6)
        .limit(6);
    } else {
      // 여성 친구
      console.log("여성 친구 2");
      return await Item.find({
        serving: { $gte: 2 },
        preferredAge: { $in: ages },
        gender: { $in: [1, 2] },
      })
        .skip((page - 1) * 6)
        .limit(6);
    }
  } else {
    // 단체
    console.log("단체 메뉴 추천");
    return await Item.find({
      serving: { $gte: 3 },
      // category: { $in: ["set"] },
      preferredAge: { $in: ages },
    })
      .skip((page - 1) * 6)
      .limit(6);
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
