const express =  require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 5000

app.use(express.json());

const dbConnect = require("./config/dbConnect");
dbConnect();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

const fileUpload = require("express-fileupload");



app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const user = require("./routes/user");
app.use("/api/", user)

app.listen(PORT, ()=>{
    console.log(`App is listinig at ${PORT}`);
})