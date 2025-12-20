const express = require("express");
const {
  renderAskQuestionPage,
  askQuestion,
  renderSingleAskPage,
} = require("../controllers/questionController");
const router = express.Router();
const { multer, storage } = require("../middleware/multerConfig");
const { isAuthenticated } = require("../middleware/isAuthenticate");
const upload = multer({ storage: storage });
router
  .route("/questions")
  .get(isAuthenticated, renderAskQuestionPage)
  .post(isAuthenticated, upload.single("image"), askQuestion);

router.route("/questions/:id").get(renderSingleAskPage);

module.exports = router;
