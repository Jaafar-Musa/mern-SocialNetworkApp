const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("DB connected");
  } catch (e) {
    console.log(e.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
