var mongoose = require("mongoose");

var appsSchema = new mongoose.Schema({

  pictures: {},

  network: {
            type: String,
            required: true
          },
  launch: {
            type: String,
            required: true
          },
  body:   {
            dimension: String,
            weight: String,
            sim: String,
            fingerprint: String,
            required: true
          },
  display: {
            type: String,
            size: String,
            resolution: String,
            protection: String,
            required: true
           },
  platform: {
            chipset: String,
            cpu: String,
            gpu: String,
            required: true
            },
  memory: {
            card: String,
            internal: String,
            required: true
          },
  camera: {
            primary: String,
            features: String,
            video: String,
            secondary: String,
            required: true
          },
  comms: {
            radio: String,
            usb: String,
            required: true
         },

  price: String,

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


module.exports = mongoose.model("PhoneSpecs", appsSchema);
