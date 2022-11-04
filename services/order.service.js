const Item = require("../models/item");

// 인원수, 남성수, 여성수, 연령대그룹
module.exports.recommendMenu = async (
  population = 1,
  men = 0,
  women = 0,
  ages = [1]
) => {
  console.log(
    `population: ${population}, men: ${men}, women: ${women}, age: ${ages}`
  );
  if (population == 1) {
    console.log("single recommend");
    return await Item.find({
      gender: men > women ? 0 : 1,
      preferredAge: { $in: ages },
    });
  } else if (population == 2) {
    if (men == women) {
      // 커플
      console.log("couple");
      return await Item.find({
        category: { $in: ["couple"] },
        preferredAge: { $in: ages },
      });
    } else if (men > women) {
      // 남성 친구
      console.log("boy friend");
      return await Item.find({
        category: { $in: ["friend"] },
        preferredAge: { $in: ages },
        gender: { $in: [0, 2] },
      });
    } else {
      // 여성 친구
      console.log("girl friend");
      return await Item.find({
        category: { $in: ["friend"] },
        preferredAge: { $in: ages },
        gender: { $in: [1, 2] },
      });
    }
  } else {
    // 단체
    console.log("group");
    return await Item.find({
      category: { $in: ["set"] },
      preferredAge: { $in: ages },
    });
  }
};
