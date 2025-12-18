const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../model/index");

exports.renderHomePage = (req, res) => {
  res.render("home");
};

exports.renderGetRegisterPage = (req, res) => {
  res.render("auth/register");
};

exports.renderHandleRegisterPage = async (req, res) => {
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
};

exports.renderGetLoginPage = (req, res) => {
  res.render("auth/login");
};

exports.renderHandleLoginPage = async (req, res) => {
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
};
