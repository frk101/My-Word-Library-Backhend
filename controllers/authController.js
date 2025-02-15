const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

global.crypto = crypto;

bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);
  return buf.map(() => Math.floor(Math.random() * 256));
});

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, nativeLanguage } =
      req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        message: "Şifre geçersiz! String formatında olmalıdır.",
        passwordType: typeof password,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthDate: new Date(birthDate),
      nativeLanguage,
    });

    await newUser.save();
    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (error) {
    console.error("Kayıt sırasında hata oluştu:", error);
    res.status(500).json({
      message: "Kayıt sırasında hata oluştu",
      error: error.message || error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "E-posta veya şifre hatalı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "E-posta veya şifre hatalı" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Giriş sırasında hata oluştu", error });
  }
};
