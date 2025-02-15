const Word = require("../models/word");

exports.addWord = async (req, res) => {
  try {
    const {
      word,
      wordLanguage,
      translation,
      translationLanguage,
      status,
      importanceLevel,
      dueDate,
    } = req.body;

    const newWord = new Word({
      word,
      wordLanguage,
      translation,
      translationLanguage,
      status: status || "learning",
      importanceLevel: importanceLevel || "önemsiz",
      dueDate,
      userId: req.user.id,
    });

    await newWord.save();
    res
      .status(201)
      .json({ message: "Kelime başarıyla eklendi!", word: newWord });
  } catch (error) {
    res.status(500).json({
      message: "Kelime eklenirken hata oluştu!",
      error: error.message,
    });
  }
};

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find({ userId: req.user.id });
    res.json(words);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kelimeler getirilemedi!", error: error.message });
  }
};

exports.updateWord = async (req, res) => {
  try {
    const updatedWord = await Word.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ message: "Kelime bulunamadı!" });
    }

    res.json({ message: "Kelime başarıyla güncellendi!", word: updatedWord });
  } catch (error) {
    res.status(500).json({
      message: "Güncelleme sırasında hata oluştu!",
      error: error.message,
    });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    const deletedWord = await Word.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedWord) {
      return res.status(404).json({ message: "Kelime bulunamadı!" });
    }

    res.json({ message: "Kelime başarıyla silindi!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Silme sırasında hata oluştu!", error: error.message });
  }
};
