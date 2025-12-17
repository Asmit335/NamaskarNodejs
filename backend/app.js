const express = require("express");
const dotenv = require("dotenv");
const { User } = require("./model/index");
require("./model/index");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  if (!username || !email || !password) {
    return res.send("Please fill all the fields.");
  }
  const userEmail = await User.findOne({ where: { email } });
  if (userEmail) {
    return res.send("Already registered with the given Email.");
  }
  const data = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("Please fill all the fields.");
  }
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    return res.status(404).json({
      message: "User Not Found. Please Register First",
    });
  }

  const isMatchedPassword = bcrypt.compareSync(password, user.password);
  if (!isMatchedPassword) {
    return res.status(401).json({
      message: "Email or Password Not Matched.",
    });
  }
  const token = jwt.sign({ id: user.id }, "haha123$$!!3354667", {
    expiresIn: "10d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running in PORT No. ${PORT}`);
});
