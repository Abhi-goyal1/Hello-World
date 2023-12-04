const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    tabId: String,
    content: String,
  });


  const content = mongoose.model("content", contentSchema);
module.exports = content;