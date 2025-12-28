const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: 3306,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected Successfully!!.");
  })
  .catch((err) => {
    console.log("Error" + err);
  });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./userModel")(sequelize, DataTypes);
db.Question = require("./questionModel")(sequelize, DataTypes);
db.Answer = require("./answerModel")(sequelize, DataTypes);
db.AnswerLike = require("./answerLikeModel")(sequelize)(DataTypes);

db.User.hasMany(db.Question);
db.Question.belongsTo(db.User);

db.Question.hasMany(db.Answer);
db.Answer.belongsTo(db.Question);

db.User.hasMany(db.Answer);
db.Answer.belongsTo(db.User);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Yes Re-Sync Done.");
});

module.exports = db;
