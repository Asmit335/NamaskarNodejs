const { Question, User } = require("../model/index");

exports.renderAskQuestionPage = async (req, res) => {
  res.render("questions/questions");
};

exports.askQuestion = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;
  const imageFileName = req.file.filename;
  if (!title || !description) {
    return res.send("Please fill title and description field");
  }
  await Question.create({
    title,
    description,
    image: imageFileName,
    userId,
  });
  res.redirect("/");
};

exports.getAllQuestion = async (req, res) => {
  const data = await Question.findAll({
    include: [
      {
        model: User,
      },
    ],
  });
};
