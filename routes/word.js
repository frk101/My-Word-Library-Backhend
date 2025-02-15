const express = require("express");
const router = express.Router();
const {
  addWord,
  getWords,
  updateWord,
  deleteWord,
} = require("../controllers/wordController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addWord);

router.get("/", authMiddleware, getWords);

router.put("/:id", authMiddleware, updateWord);

router.delete("/:id", authMiddleware, deleteWord);

module.exports = router;
