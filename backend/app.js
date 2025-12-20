const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
require("./model/index");
const app = express();
const authRoute = require("./routes/authRoutes");
const logoutRoute = require("./routes/authRoutes");
const questionRoute = require("./routes/questionRoutes");
const { renderHomePage } = require("./controllers/authController");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public/css"));
app.use(cookieParser());
app.use("/storage", express.static(path.join(__dirname, "storage")));

dotenv.config();

app.use((req, res, next) => {
  const token = req.cookies.token;
  res.locals.isLoggedIn = !!token;
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

app.listen(PORT, () => {
  console.log(`Server is running in PORT No. ${PORT}`);
});
