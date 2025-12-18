const express = require("express");
const {
  renderAskQuestionPage,
  askQuestion,
} = require("../controllers/questionController");
const router = express.Router();
const { multer, storage } = require("../middleware/multerConfig");
const upload = multer({ storage: storage });
router
  .route("/questions")
  .get(renderAskQuestionPage)
  .post(upload.single("image"), askQuestion);

module.exports = router;
