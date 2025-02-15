const express = require("express");
const router = express.Router();
const {
  getQuizQuestions,
  submitQuiz,
} = require("../controllers/quizController"); // ✅ submitQuiz eklendi
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getQuizQuestions);
router.post("/submit", authMiddleware, submitQuiz); // ✅ Quiz cevaplarını gönderme endpointi eklendi

module.exports = router;
