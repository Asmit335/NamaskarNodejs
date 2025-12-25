const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Question } = require("../model/index");
const sendEmail = require("../utils/sendMail");

exports.renderHomePage = async (req, res) => {
  const data = await Question.findAll({
    include: [
      {
        model: User,
        // attributes: ["username"],
      },
    ],
  });
  res.render("home", { data });
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
    req.flash("error", "Already registered with the given Email.");
    return res.redirect("/register");
  }
  const data = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  req.flash("success", "User Registered Successfully.");
  res.redirect("/login");
};

exports.renderGetLoginPage = (req, res) => {
  res.render("auth/login");
};

exports.renderHandleLoginPage = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Please fill all the fields.");
    return res.redirect("/login");
  }
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    req.flash("error", "User Not Found. Please Register First");
    return res.redirect("/login");
  }

  const isMatchedPassword = bcrypt.compareSync(password, user.password);
  if (!isMatchedPassword) {
    req.flash("error", "Email or password is incorrect.");
    return res.redirect("/login");
  }
  const token = jwt.sign({ id: user.id }, "haha123$$!!3354667", {
    expiresIn: "10d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  req.flash("success", "User LoggedIn Successfully.");
  res.redirect("/");
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  req.flash("success", "User LoggedOut Successfully.");
  res.redirect("/login");
};

exports.renderForgetPasswordPage = async (req, res) => {
  res.render("auth/forgetPassword");
};
const otpStore = {};
exports.handleForgetPasswordPage = async (req, res) => {
  const { email } = req.body;
  const data = await User.findOne({
    where: { email },
  });
  if (!data) {
    req.flash("error", "No registered with the given Email.");
    return res.redirect("/forget");
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = Date.now() + 10 * 60 * 1000; //valid for 10 minutes
  otpStore[email] = { otp, expiresAt };
  console.log("otpverify:", otpStore[email].otp);
  req.session.forgetEmail = email;

  await sendEmail({
    email: email,
    subject: "Forget Password OTP!",
    message: `Your reset Password OTP is ${otp}. It is valid for 10 minutes only.`,
  });
  res.redirect("/verifyotp");
};

exports.renderVerifyOtpPage = async (req, res) => {
  const email = req.session.forgetEmail;
  res.render("auth/enterOtp", { email });
};

exports.handleVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record) {
    req.flash("error", "OTP not found. Please request again.");
    return res.redirect("/verifyotp");
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    req.flash("error", "OTP expired. Please request again.");
    return res.redirect("/verifyotp");
  }

  if (record.otp != otp) {
    req.flash("error", "Incorrect OTP. Try again.");
    return res.redirect("/verifyotp");
  }

  //otp valid vayama
  delete otpStore[email];
  console.log("otp verified.");
  res.redirect("/resetpassword");
};

exports.renderResetPasswordPage = async (req, res) => {
  const { email } = req.session.forgetEmail;
  res.render("auth/resetPassword", { email });
};

exports.handleResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const email = req.session.forgetEmail;
  if (!email) {
    return res.send("Session expired. Please try again.");
  }
  if (password !== confirmPassword) {
    return res.send("Passwords do not Match.");
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const updated = await User.update(
    { password: hashPassword },
    { where: { email } }
  );
  if (updated[0] === 0) {
    return res.send("Password update failed.");
  }
  delete req.session.forgetEmail;
  // res.send("Password reset successful. You can now login");
  res.redirect("/login");
};
