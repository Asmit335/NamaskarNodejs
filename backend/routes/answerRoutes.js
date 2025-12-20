const express = require("express");
const { isAuthenticated } = require("../middleware/isAuthenticate");
const { renderSingleAnswerPage } = require("../controllers/answerController");

const router = express.Router();

router.route("/:id").get(isAuthenticated, renderSingleAnswerPage);

module.exports = router;
