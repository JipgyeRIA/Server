const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    customerId: Schema.Types.ObjectId,
    group: String,
    emb: String,
    age: Number,
    gender: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
