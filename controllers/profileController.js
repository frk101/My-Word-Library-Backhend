const User = require("../models/user");
const multer = require("multer");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      totalScore: user.totalScore,
      quizCount: user.quizCount,
      starRating: user.starRating.toFixed(2),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Profil getirilemedi!", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Güncelleme sırasında hata oluştu", error });
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
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: req.file.path },
        { new: true }
      );
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Fotoğraf yükleme sırasında hata oluştu", error });
    }
  },
];

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Kullanıcı silindi" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı silinirken hata oluştu", error });
  }
};
