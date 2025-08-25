

const File = require("../model/File");
const cloudinary = require("cloudinary").v2;
const { sendEmail } = require("../service/email");

function isFileType(type, supportedType) {
  return supportedType.includes(type);
}

const uploadToCloudinary = async (file, folder, quality) => {
  const options = { folder };
  options.resource_type = "auto";
  if (quality) {
    options.quality = quality;
  }
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.imageUpload = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(name, email);

    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Use field name 'imageFile'",
      });
    }

    const file = req.files.imageFile;
    const supportedType = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".").pop().toLowerCase();

    if (!isFileType(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "File not Supported",
      });
    }

    const response = await uploadToCloudinary(file, "FileLB");
    console.log(response);

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

 
    const Data = await File.create({
      name,
      email,
      fileName: file.name,
      fileURL: response.secure_url,
      expiryTime: expiry,
      downloadCount: 0,
    });

    
    sendEmail(Data);

    res.json({
      success: true,
      data: Data,
      message: "File Uploaded Successfully (valid for 10 minutes)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

   
    if (file.expiryTime && Date.now() > file.expiryTime.getTime()) {
      return res.status(410).json({ message: "Download link expired" });
    }

    file.downloadCount++;
    await file.save();

    if (req.query.redirect === "1") {
      return res.redirect(file.fileURL);
    }

    res.json({
      url: file.fileURL,
      filename: file.fileName, 
      downloads: file.downloadCount,
    });
  } catch (err) {
    console.error("Error in downloading the files", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
