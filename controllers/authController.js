const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { messages, getLang } = require("../config/messages");

global.crypto = crypto;

bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);
  return buf.map(() => Math.floor(Math.random() * 256));
});

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, nativeLanguage } =
      req.body;
    const lang = getLang(req);

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: messages[lang].invalidPassword });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: messages[lang].emailExists });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthDate,
      nativeLanguage,
    });

    await newUser.save();
    res.status(201).json({ message: messages[lang].registerSuccess });
  } catch (error) {
    res
      .status(500)
      .json({
        message: messages[getLang(req)].serverError,
        error: error.message,
      });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lang = getLang(req);

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: messages[lang].loginError });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: messages[lang].loginError });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: messages[lang].loginSuccess, token, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: messages[getLang(req)].serverError, error });
  }
};
