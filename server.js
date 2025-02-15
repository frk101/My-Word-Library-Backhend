require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const wordRoutes = require("./routes/word");
const quizRoutes = require("./routes/quiz");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/quiz", quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server 5001 portunda çalışıyor"));

///frkalbayrak101
///2IpgTDT5bUWi07Jv
