const express = require("express");
const {
  renderGetRegisterPage,
  renderHandleRegisterPage,
  renderGetLoginPage,
  renderHandleLoginPage,
} = require("../controllers/authController");
const router = express.Router();

router
  .route("/register")
  .get(renderGetRegisterPage)
  .post(renderHandleRegisterPage);

router.route("/login").get(renderGetLoginPage).post(renderHandleLoginPage);

module.exports = router;
