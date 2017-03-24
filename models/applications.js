var mongoose = require("mongoose");

var appsSchema = new mongoose.Schema({

  icon:     String,
  name:     String,
  content:  String,
  version:  String,
  downloadLinks: {

      local: String,
      appStore: String,
      playMarket: String
  },

  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    fullname: String,
    pic: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Apps", appsSchema);
