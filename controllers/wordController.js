const Word = require("../models/word");
const { messages, getLang } = require("../config/messages");

exports.addWord = async (req, res) => {
  try {
    const lang = getLang(req);
    const { firstWord, secondWord, status, importanceLevel, dueDate } =
      req.body;

    // **Eğer aynı kelime veya çevirisi zaten ekliyse hata döndür**
    const existingWord = await Word.findOne({
      userId: req.user.id,
      $or: [
        { "firstWord.text": firstWord.text },
        { "secondWord.text": secondWord.text },
      ],
    });

    if (existingWord) {
      return res.status(400).json({ message: messages[lang].wordExists });
    }

    // **Yeni kelimeyi ekle**
    const newWord = new Word({
      firstWord,
      secondWord,
      status: status || "learning",
      importanceLevel: importanceLevel || "önemsiz",
      dueDate,
      userId: req.user.id,
    });

    await newWord.save();
    res.status(201).json({ message: messages[lang].wordAdded, word: newWord });
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].serverError,
      error: error.message,
    });
  }
};

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find({ userId: req.user.id });
    res.json(words);
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].wordsFetchError,
      error: error.message,
    });
  }
};

exports.updateWord = async (req, res) => {
  try {
    const lang = getLang(req);
    const updatedWord = await Word.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ message: messages[lang].wordNotFound });
    }

    res.json({ message: messages[lang].wordUpdated, word: updatedWord });
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].wordUpdateError,
      error: error.message,
    });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    const lang = getLang(req);
    const deletedWord = await Word.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedWord) {
      return res.status(404).json({ message: messages[lang].wordNotFound });
    }

    res.json({ message: messages[lang].wordDeleted });
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].wordDeleteError,
      error: error.message,
    });
  }
};
