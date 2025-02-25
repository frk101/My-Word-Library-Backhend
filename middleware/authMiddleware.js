const jwt = require("jsonwebtoken");
const { messages, getLang } = require("../config/messages");

const authMiddleware = (req, res, next) => {
  const lang = getLang(req);
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: messages[lang].authRequired });
  }

  try {
    const cleanToken = token.replace("Bearer ", "").trim();
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: messages[lang].invalidToken,
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
