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

// exports.renderSingleAskPage = async (req, res) => {
//   const { id } = req.params;
//   const question = await Question.findOne({
//     where: {
//       id,
//     },
//     include: [
//       {
//         model: User,
//       },
//     ],
//   });
//   res.render("questions/singleQuestion", { question });
// };

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

exports.renderSingleAskPage = async (req, res) => {
  const question = await Question.findOne({
    where: { id: req.params.id },
    include: [{ model: User }],
  });

  question.timeAgo = timeAgo(question.createdAt);

  res.render("questions/singleQuestion", { question });
};
