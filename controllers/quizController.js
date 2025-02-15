const User = require("../models/user");
const Word = require("../models/word");

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    let score = 0;

    for (let ans of answers) {
      const word = await Word.findById(ans.wordId);
      if (word && word.translation === ans.answer) {
        score += 10;
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
      message: "Quiz tamamlandı!",
      score,
      starRating: user.starRating.toFixed(2),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Quiz sonucu kaydedilemedi!", error: error.message });
  }
};

exports.getQuizQuestions = async (req, res) => {
  try {
    console.log("📌 Quiz API'ye istek geldi...");

    const words = await Word.find({ userId: req.user.id });

    console.log("📌 Kullanıcının kelime sayısı:", words.length);

    if (words.length < 20) {
      return res
        .status(400)
        .json({ message: "Quiz için en az 20 kelime eklemelisiniz!" });
    }

    const quizWords = words.sort(() => 0.5 - Math.random()).slice(0, 20);
    console.log("📌 Rastgele seçilen 20 kelime:", quizWords.length);

    const quizQuestions = quizWords.map((word) => {
      const questionType =
        Math.random() > 0.5 ? "word-to-translation" : "translation-to-word";
      let correctAnswer,
        questionText,
        wrongAnswers = [];

      if (questionType === "word-to-translation") {
        correctAnswer = word.translation;
        questionText = `"${word.word}" kelimesinin çevirisi nedir?`;

        let possibleTranslations = words
          .filter((w) => w.translation !== correctAnswer)
          .map((w) => w.translation)
          .sort(() => 0.5 - Math.random());

        wrongAnswers = possibleTranslations.slice(0, 3);
      } else {
        correctAnswer = word.word;
        questionText = `"${word.translation}" hangi kelimenin çevirisidir?`;

        let possibleWords = words
          .filter((w) => w.word !== correctAnswer)
          .map((w) => w.word)
          .sort(() => 0.5 - Math.random());

        wrongAnswers = possibleWords.slice(0, 3);
      }

      if (wrongAnswers.length < 3) {
        console.warn(
          "❗ Yeterli yanlış seçenek bulunamadı. Yanlış seçenek sayısı:",
          wrongAnswers.length
        );
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

    console.log("📌 Quiz soruları oluşturuldu. Toplam:", quizQuestions.length);
    res.json(quizQuestions);
  } catch (error) {
    console.error("🚨 Quiz API'de hata oluştu:", error);
    res
      .status(500)
      .json({
        message: "Quiz oluşturulurken hata oluştu!",
        error: error.message,
      });
  }
};
