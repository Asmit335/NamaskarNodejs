module.exports = (sequelize, DataTypes) => {
  const AnswerLike = sequelize.define(
    "AnswerLike",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "answerId"],
        },
      ],
    }
  );

  return AnswerLike;
};
