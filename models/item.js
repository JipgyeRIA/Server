const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    itemId: Schema.Types.ObjectId,
    name: String,
    price: Number,
    composed: String,
    serving: Number,
    category: [String],
    img: String,
    preferredAge: { type: [Number], default: 0 },
    gender: Number,
    orderCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
