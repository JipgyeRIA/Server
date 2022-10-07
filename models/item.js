const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    itemId: Schema.Types.ObjectId,
    name: String,
    price: Number,
    composed: String,
    servings: Number,
    category: [String],
    img: String,
    preferredAge: { type: Number, default: 0 },
    preferredGender: { type: String, default: "ALL" },
    orderCount: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
