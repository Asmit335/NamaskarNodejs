const { Answer } = require("../model");

exports.renderSingleAnswerPage = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  const userId = req.userId;
  const data = await Answer.create({
    answerText: answer,
    questionId: id,
    userId: userId,
  });
  console.log("answerData:", data);

  res.redirect(`/questions/${id}`);
};
