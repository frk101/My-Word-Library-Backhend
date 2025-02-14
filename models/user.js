const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  birthDate: { type: Date, required: true },
  nativeLanguage: { type: String, required: true },
  profilePicture: { type: String, default: "" },
});

module.exports = mongoose.model("User", UserSchema);
