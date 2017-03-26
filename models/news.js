var mongoose = require("mongoose");

var postsSchema = new mongoose.Schema({
  
  billboard: String, 
  title:     String,
  tag:       {},
  content:   String,

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


module.exports = mongoose.model("Post", postsSchema);
