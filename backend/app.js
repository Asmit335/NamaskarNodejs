const express = require("express");
const dotenv = require("dotenv");
const { User } = require("./model/index");
require("./model/index");
const app = express();
// const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/css"));

dotenv.config();

const PORT = process.env.PORT || 4000;
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("auth/register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const data = await User.create({ username, email, password });
  res.status(200).json({
    message: "Register Done Successfully.",
    data: data,
  });
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.listen(PORT, () => {
  console.log(`Server is running in PORT No. ${PORT}`);
});
