const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// **Kullanıcı Kaydı**
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, nativeLanguage } =
      req.body;
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthDate,
      nativeLanguage,
    });

    await newUser.save();
    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (error) {
    res.status(500).json({ message: "Kayıt sırasında hata oluştu", error });
  }
};

// **Kullanıcı Girişi**
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "E-posta veya şifre hatalı" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "E-posta veya şifre hatalı" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Giriş sırasında hata oluştu", error });
  }
};
