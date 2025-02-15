const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Yetkisiz erişim, token gerekli!" });
  }

  try {
    const cleanToken = token.replace("Bearer ", "").trim();

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token", error: error.message });
  }
};

module.exports = authMiddleware;
