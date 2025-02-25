const User = require("../models/user");
const multer = require("multer");
const { messages, getLang } = require("../config/messages");

exports.getProfile = async (req, res) => {
  try {
    const lang = getLang(req);
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: messages[lang].profileNotFound });
    }

    res.json({
      message: messages[lang].profileFetched,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      totalScore: user.totalScore,
      quizCount: user.quizCount,
      starRating: user.starRating.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].serverError,
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const lang = getLang(req);
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    res.json({ message: messages[lang].profileUpdated, updatedUser });
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].profileUpdateError,
      error,
    });
  }
};

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, req.user.id + "-" + Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

exports.uploadProfilePicture = [
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const lang = getLang(req);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: req.file.path },
        { new: true }
      );

      res.json({ message: messages[lang].profileUpdated, user });
    } catch (error) {
      res.status(500).json({
        message: messages[getLang(req)].profilePictureUploadError,
        error,
      });
    }
  },
];

exports.deleteUser = async (req, res) => {
  try {
    const lang = getLang(req);
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: messages[lang].userDeleted });
  } catch (error) {
    res.status(500).json({
      message: messages[getLang(req)].userDeleteError,
      error,
    });
  }
};
