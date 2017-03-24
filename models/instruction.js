var mongoose = require("mongoose");

var manualsSchema = new mongoose.Schema({

  billboard: {type: String, required: true},
  title: {type: String, required: true},
  tag: {type: String, required: true},
  video: {type: String, required: true},
  content: {type: String, required: true},

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


module.exports = mongoose.model("Manuals", manualsSchema);
/**
 * Created by Sandro on 3/5/17.
 */
