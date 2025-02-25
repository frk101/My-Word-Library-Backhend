const mongoose = require("mongoose");

const WordSchema = new mongoose.Schema({
  firstWord: {
    text: { type: String, required: true },
    language: { type: String, required: true },
  },
  secondWord: {
    text: { type: String, required: true },
    language: { type: String, required: true },
  },
  status: { type: String, enum: ["learning", "learned"], default: "learning" },
  importanceLevel: {
    type: String,
    enum: ["önemli", "az önemli", "önemsiz"],
    default: "önemsiz",
  },
  dueDate: { type: Date, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Word", WordSchema);
