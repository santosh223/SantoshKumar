const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },   
    email: { 
        type: String, 
        required: true 
    },
    fileName: { 
        type: String, 
        required: true 
    },
    fileURL: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiryTime: { 
        type: Date 
    },
    downloadCount: { 
        type: Number, 
        default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
