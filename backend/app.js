const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require("./model/index");
const app = express();
const authRoute = require("./routes/authRoutes");
const logoutRoute = require("./routes/authRoutes");
const questionRoute = require("./routes/questionRoutes");
const answerRoute = require("./routes/answerRoutes");
const { renderHomePage } = require("./controllers/authController");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const { Answer, AnswerLike } = require("./model/index");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000 }, // optional, session expires in 10 min
  })
);

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public/css"));
app.use(cookieParser());
app.use("/storage", express.static(path.join(__dirname, "storage")));

dotenv.config();

app.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.isLoggedIn = false;
    return next();
  }
  try {
    const verifyToken = await promisify(jwt.verify)(
      token,
      "haha123$$!!3354667"
    );
    if (verifyToken) {
      res.locals.isLoggedIn = true;
    } else {
      res.locals.isLoggedIn = false;
    }
  } catch (error) {
    res.locals.isLoggedIn = false;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// const path = require("path");

app.get("/", renderHomePage);

app.use("/", authRoute);
app.use("/", questionRoute);
app.use("/", logoutRoute);
app.use("/", answerRoute);

const server = app.listen(PORT, () => {
  console.log(`Server is running in PORT No. ${PORT}`);
});

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //like logic
  socket.on("likes", async (data) => {
    const answerLike = await Answer.findByPk(data);
    if (!answerLike) return;
    answerLike.likes += 1;
    await answerLike.save();

    io.emit("updateLike", { id: answerLike.id, likes: answerLike.likes });
  });

  //dislike logic
  socket.on("dislikes", async (data) => {
    const answerDisLike = await Answer.findByPk(data);
    if (!answerDisLike) return;
    answerDisLike.dislikes += 1;
    await answerDisLike.save();
    io.emit("updateDislike", {
      id: answerDisLike.id,
      dislikes: answerDisLike.dislikes,
    });
  });

  //answerlikebyUserTracking
  // socket.userId = socket.request.session.user.id;

  // socket.on("likeAnswer", async (answerId) => {
  //   const userId = socket.userId;
  //   const alreadyLiked = await AnswerLike.findOne({
  //     where: { userId, answerId },
  //   });
  //   if (alreadyLiked) return;

  //   await AnswerLike.create({ userId, answerId });
  //   const answer = await Answer.findByPk(answerId);
  //   answer.likes += 1;
  //   await answer.save();

  //   io.emit("updateLike", {
  //     id: answer.id,
  //     likes: answer.likes,
  //   });
  // });
});
