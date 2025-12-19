const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { User } = require("../model/index");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);

  if (!token) {
    return res.redirect("/login");
  }

  const verifyToken = await promisify(jwt.verify)(token, "haha123$$!!3354667");
  const data = await User.findByPk(verifyToken.id);
  if (!data) {
    return res.send("Invalid Token.");
  }
  req.userId = verifyToken.id;
  next();
};
