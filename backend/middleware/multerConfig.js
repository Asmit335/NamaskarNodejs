const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const allowedFile = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedFile) {
      return cb(new Error("Invalid file type."));
    }
    cb(null, "./storage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = { storage, multer };
