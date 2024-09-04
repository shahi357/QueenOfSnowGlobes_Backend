const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const customOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, default: uuidv4, unique: true },
    email: { type: String, required: true },
    projectName: {
      type: String,
      required: true,
    },
    template: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomOrder", customOrderSchema);
