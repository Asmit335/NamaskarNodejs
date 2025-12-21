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
const cookieParser = require("cookie-parser");

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

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// const path = require("path");

app.get("/", renderHomePage);

app.use("/", authRoute);
app.use("/", questionRoute);
app.use("/", logoutRoute);
app.use("/", answerRoute);

app.listen(PORT, () => {
  console.log(`Server is running in PORT No. ${PORT}`);
});
