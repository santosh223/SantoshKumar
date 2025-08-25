const express = require("express");
const router = express.Router();

const {signup,login} = require("../controller/registerUser");
const{imageUpload,downloadFile} = require("../controller/fileUpload")

router.post("/signup", signup);
router.post("/login", login);

router.post("/imageUpload",imageUpload)
router.get("/download/:id", downloadFile);



module.exports = router;