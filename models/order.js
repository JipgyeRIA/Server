const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderId: Schema.Types.ObjectId,
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    itemId: { type: Schema.Types.ObjectId, ref: "Item" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
