const express = require("express");
const {
  renderGetRegisterPage,
  renderHandleRegisterPage,
  renderGetLoginPage,
  renderHandleLoginPage,
  logout,
  renderForgetPasswordPage,
  handleForgetPasswordPage,
  renderVerifyOtpPage,
} = require("../controllers/authController");
const router = express.Router();

router
  .route("/register")
  .get(renderGetRegisterPage)
  .post(renderHandleRegisterPage);

router.route("/login").get(renderGetLoginPage).post(renderHandleLoginPage);
router.route("/logout").get(logout);
router
  .route("/forget")
  .get(renderForgetPasswordPage)
  .post(handleForgetPasswordPage);
router.route("/verifyotp").get(renderVerifyOtpPage);
module.exports = router;
