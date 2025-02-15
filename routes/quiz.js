const express = require("express");
const router = express.Router();
const {
  getQuizQuestions,
  submitQuiz,
} = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getQuizQuestions);
router.post("/submit", authMiddleware, submitQuiz);

module.exports = router;
