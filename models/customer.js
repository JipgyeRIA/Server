const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    customerId: Schema.Types.ObjectId,
    groupNum: int,
    img_vector: String,
    age: int,
    gender: int,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
