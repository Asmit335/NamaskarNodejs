const express = require("express");
const dotenv = require("dotenv");
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
app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.listen(PORT, () => {
  console.log(`Server is running in PORT No. ${PORT}`);
});
