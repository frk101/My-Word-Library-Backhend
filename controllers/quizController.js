const User = require("../models/user");
const Word = require("../models/word");
const { messages, getLang } = require("../config/messages");

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const lang = getLang(req);
    let score = 0;

    for (let ans of answers) {
      const word = await Word.findById(ans.wordId);
      if (word) {
        const correctAnswer =
          ans.type === "word-to-translation"
            ? word.secondWord.text
            : word.firstWord.text;

        if (correctAnswer === ans.answer) {
          score += 10;
        }
      }
    }

    const user = await User.findById(req.user.id);
    if (user) {
      user.totalScore += score;
      user.quizCount += 1;
      user.starRating = Math.min(
        5,
        (user.totalScore / (user.quizCount * 50)) * 5
      );
      await user.save();
    }

    res.json({
      message: messages[lang].quizCompleted,
      score,
      starRating: user.starRating.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].quizSubmitError,
      error: error.message,
    });
  }
};

exports.getQuizQuestions = async (req, res) => {
  try {
    const lang = getLang(req);
    const words = await Word.find({ userId: req.user.id });

    if (words.length < 20) {
      return res
        .status(400)
        .json({ message: messages[lang].quizNotEnoughWords });
    }

    const quizWords = words.sort(() => 0.5 - Math.random()).slice(0, 20);

    const quizQuestions = quizWords.map((word) => {
      const questionType =
        Math.random() > 0.5 ? "word-to-translation" : "translation-to-word";
      let correctAnswer,
        questionText,
        wrongAnswers = [];

      if (questionType === "word-to-translation") {
        correctAnswer = word.secondWord.text;
        questionText = `"${word.firstWord.text}" kelimesinin çevirisi nedir?`;

        let possibleTranslations = words
          .filter((w) => w.secondWord.text !== correctAnswer)
          .map((w) => w.secondWord.text)
          .sort(() => 0.5 - Math.random());

        wrongAnswers = possibleTranslations.slice(0, 3);
      } else {
        correctAnswer = word.firstWord.text;
        questionText = `"${word.secondWord.text}" hangi kelimenin çevirisidir?`;

        let possibleWords = words
          .filter((w) => w.firstWord.text !== correctAnswer)
          .map((w) => w.firstWord.text)
          .sort(() => 0.5 - Math.random());

        wrongAnswers = possibleWords.slice(0, 3);
      }

      if (wrongAnswers.length < 3) {
        console.warn(" Yanlış seçenek sayısı:", wrongAnswers.length);
      }

      const options = [...wrongAnswers, correctAnswer].sort(
        () => Math.random() - 0.5
      );

      return {
        wordId: word._id,
        question: questionText,
        type: questionType,
        options,
        correctAnswer,
      };
    });

    res.json(quizQuestions);
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].quizGenerateError,
      error: error.message,
    });
  }
};
